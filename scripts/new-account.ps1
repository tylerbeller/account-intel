#Requires -Version 5.1
<#
.SYNOPSIS
    Generate a sourced account brief and/or deal model for a target account, headlessly.

.EXAMPLE
    .\scripts\new-account.ps1 -Account "Lowe's"
    .\scripts\new-account.ps1 -Account "Delta Air Lines" -Mode both
#>
param(
    [Parameter(Mandatory = $true)][string]$Account,
    [ValidateSet('brief', 'deal', 'both')][string]$Mode = 'brief',
    [ValidateSet('low', 'medium', 'high')][string]$Auto = 'medium',
    [string]$Model = '',
    [int]$MinSources = 10,
    [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

# The CLI is not always on PATH, so resolve it the same way every time.
$droid = if ($env:DROID_BIN) { $env:DROID_BIN } else { Join-Path $env:USERPROFILE 'bin\droid.exe' }
if (-not (Test-Path $droid)) {
    $onPath = Get-Command droid -ErrorAction SilentlyContinue
    if ($onPath) { $droid = $onPath.Source } else { throw "droid CLI not found. Set DROID_BIN to its full path." }
}

$slug = (($Account.ToLower() -replace "[^a-z0-9]+", '-').Trim('-'))
$outDir = Join-Path $repo "briefs\$slug"
if (-not $DryRun) {
    New-Item -ItemType Directory -Force -Path $outDir, (Join-Path $repo 'logs') | Out-Null
}

$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$targets = if ($Mode -eq 'both') { @('brief', 'deal') } else { @($Mode) }
$results = @()

foreach ($t in $targets) {
    if ($t -eq 'brief') {
        $outFile = Join-Path $outDir 'brief.md'
        $prompt = "/account-brief $Account`n`nWrite the finished brief to briefs/$slug/brief.md. Research in parallel as the skill instructs. When done, report the output path, the number of distinct sources cited, and the top three unknowns."
    } else {
        $outFile = Join-Path $outDir 'deal-model.md'
        $prompt = "/deal-model $Account`n`nWrite the finished deal model to briefs/$slug/deal-model.md. If briefs/$slug/brief.md exists, read it first and reuse its sourced facts. When done, report the output path and every dimension still marked Gap."
    }

    $log = Join-Path $repo "logs\$slug-$t-$stamp.log"
    Write-Host ""
    Write-Host ("=== $t : $Account ===") -ForegroundColor Cyan
    Write-Host ("    output : " + $outFile)
    Write-Host ("    log    : " + $log)

    if ($DryRun) {
        Write-Host "    (dry run, prompt only)" -ForegroundColor Yellow
        Write-Host $prompt
        continue
    }

    $cliArgs = @('exec', '--auto', $Auto)
    if ($Model) { $cliArgs += @('--model', $Model) }
    $cliArgs += $prompt

    # The CLI streams progress on stderr. Under ErrorActionPreference=Stop, PowerShell
    # promotes that to a terminating NativeCommandError, so relax it for the call only.
    $prevEap = $ErrorActionPreference
    Push-Location $repo
    try {
        $ErrorActionPreference = 'Continue'
        & $droid @cliArgs 2>&1 | Tee-Object -FilePath $log
        $exit = $LASTEXITCODE
    } finally {
        $ErrorActionPreference = $prevEap
        Pop-Location
    }

    # Verification gate: the run is only a success if it produced a sourced artifact.
    $problems = @()
    if ($exit -ne 0) { $problems += "droid exec exited $exit" }
    if (-not (Test-Path $outFile)) {
        $problems += "no output file at $outFile"
        $sources = 0
    } else {
        $text = Get-Content $outFile -Raw
        $sources = ([regex]::Matches($text, 'https?://')).Count
        if ($sources -lt $MinSources) { $problems += "only $sources source links, expected at least $MinSources" }
        if ($text -notmatch '(?i)unknown') { $problems += 'no unknowns section' }
    }

    # Counting links proves nothing on its own, so resolve them too.
    $dead = 'not checked'
    if (Test-Path $outFile) {
        $verify = Join-Path $repo 'scripts\verify-sources.ps1'
        $vLog = Join-Path $repo "logs\$slug-$t-$stamp-sources.log"
        & powershell -NoProfile -ExecutionPolicy Bypass -File $verify -Path $outFile -Quiet *> $vLog
        $vExit = $LASTEXITCODE
        $vText = Get-Content $vLog -Raw
        if ($vText -match 'Dead\s+:\s+(\d+)') { $dead = [int]$matches[1] }
        if ($vExit -ne 0) { $problems += "$dead unresolved source link(s), see $vLog" }
    }

    $results += [pscustomobject]@{ Artifact = $t; File = $outFile; Sources = $sources; Dead = $dead; Problems = ($problems -join '; ') }
}

if ($DryRun) { return }

Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
$results | Format-Table Artifact, Sources, Dead, Problems -AutoSize
$failed = @($results | Where-Object { $_.Problems })
if ($failed.Count -gt 0) {
    Write-Host ("FAILED: " + $failed.Count + " of " + $results.Count + " artifacts did not pass the evidence gate.") -ForegroundColor Red
    exit 1
}
Write-Host ("OK: " + $results.Count + " artifact(s) written and past the evidence gate.") -ForegroundColor Green
