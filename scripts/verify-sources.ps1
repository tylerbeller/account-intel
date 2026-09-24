#Requires -Version 5.1
<#
.SYNOPSIS
    Validate every source URL in a generated artifact.

.DESCRIPTION
    Counting citations proves nothing: a fabricated URL looks identical to a real one
    in a word count. This resolves each link and classifies it.

    Two real-world cases this handles deliberately:

    1. Soft 404s. Several corporate newsrooms answer HTTP 200 with a "page not found"
       body, so a status code alone is not evidence the page exists. The body is checked
       for not-found markers.
    2. Bot blocking. SEC, Reuters, and similar hosts reject or throttle non-browser
       clients. That is not evidence the citation is wrong, so those are reported as
       WARN and do not fail the run.

    Only hard failures (404/410, DNS failure) fail the gate.

.EXAMPLE
    .\scripts\verify-sources.ps1 -Path .\briefs\lowe-s\brief.md
#>
param(
    [Parameter(Mandatory = $true)][string]$Path,
    [int]$TimeoutSec = 20,
    [switch]$Quiet
)

$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$files = if (Test-Path $Path -PathType Container) {
    Get-ChildItem $Path -Recurse -Filter '*.md' | Select-Object -ExpandProperty FullName
} else {
    @($Path)
}

$notFoundMarkers = @('page not found', "doesn't currently exist", 'does not exist', 'page cannot be found', '404 not found')
$ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36'
$rows = @()

$allUrls = @()
foreach ($file in $files) {
    $text = Get-Content $file -Raw
    [regex]::Matches($text, 'https?://[^\s\)\]<>"]+') | ForEach-Object {
        $allUrls += [pscustomobject]@{ Url = $_.Value.TrimEnd('.', ',', ';'); File = Split-Path $file -Leaf }
    }
}

# One request per distinct URL, even when several artifacts cite it.
$grouped = $allUrls | Group-Object Url | Sort-Object Name
foreach ($g in $grouped) {
    $file = ($g.Group | Select-Object -ExpandProperty File -Unique) -join ','
    foreach ($u in @($g.Name)) {
        $status = ''
        $verdict = ''
        try {
            $resp = Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec $TimeoutSec -UserAgent $ua -MaximumRedirection 5
            $status = [int]$resp.StatusCode
            $body = ''
            if ($resp.Content -is [string]) { $body = $resp.Content.ToLower() }
            $soft = $false
            foreach ($m in $notFoundMarkers) {
                # Only the head of the document: a real article may discuss 404s in its text.
                $head = if ($body.Length -gt 4000) { $body.Substring(0, 4000) } else { $body }
                if ($head -like "*$m*") { $soft = $true; break }
            }
            $verdict = if ($soft) { 'SOFT404' } else { 'OK' }
        } catch {
            $r = $_.Exception.Response
            if ($r -and $r.StatusCode) {
                $status = [int]$r.StatusCode
                $verdict = switch ($status) {
                    404 { 'DEAD' }
                    410 { 'DEAD' }
                    403 { 'BLOCKED' }
                    429 { 'BLOCKED' }
                    default { 'WARN' }
                }
            } else {
                $status = 'no-response'
                $verdict = if ($_.Exception.Message -match 'remote name could not be resolved|No such host') { 'DEAD' } else { 'WARN' }
            }
        }

        $rows += [pscustomobject]@{
            Verdict = $verdict
            Status  = $status
            Host    = ([uri]$u).Host
            Url     = $u
            File    = $file
        }
        if (-not $Quiet) { Write-Host ("  {0,-8} {1,-12} {2}" -f $verdict, $status, $u) }
    }
}

$dead = @($rows | Where-Object { $_.Verdict -eq 'DEAD' })
$soft = @($rows | Where-Object { $_.Verdict -eq 'SOFT404' })
$blocked = @($rows | Where-Object { $_.Verdict -in @('BLOCKED', 'WARN') })
$ok = @($rows | Where-Object { $_.Verdict -eq 'OK' })

Write-Host ''
Write-Host ("Sources checked : " + $rows.Count)
Write-Host ("  OK            : " + $ok.Count)
Write-Host ("  Bot-blocked   : " + $blocked.Count + "  (not a failure; verify by hand if the claim is load-bearing)")
Write-Host ("  Soft 404      : " + $soft.Count + "  (200 with a not-found body; confirm the slug)")
Write-Host ("  Dead          : " + $dead.Count)

if ($soft.Count -gt 0) {
    Write-Host ''
    Write-Host 'SOFT 404 — confirm these resolve in a browser before quoting them:' -ForegroundColor Yellow
    $soft | ForEach-Object { Write-Host ("  " + $_.Url) }
}

if ($dead.Count -gt 0) {
    Write-Host ''
    Write-Host 'DEAD — open each of these in a browser before the claim is used:' -ForegroundColor Red
    $dead | ForEach-Object { Write-Host ("  " + $_.Status + "  " + $_.Url) }
    Write-Host ''
    Write-Host 'Two benign causes are common, so confirm before assuming the citation is wrong:' -ForegroundColor Yellow
    Write-Host '  410 on a job board  — postings expire. Keep the captured quote and date; expect the link to rot.'
    Write-Host '  404 behind a WAF    — some hosts answer non-browser clients with 404 for pages that do exist.'
    exit 1
}

Write-Host ''
Write-Host 'No dead links.' -ForegroundColor Green
exit 0
