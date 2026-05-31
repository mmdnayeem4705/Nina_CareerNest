# Stop anything on port 8080, then start Spring Boot
Set-Location $PSScriptRoot
& "$PSScriptRoot\stop.ps1"
Write-Host ""
Write-Host "Starting Nina Organization backend..."
& "$PSScriptRoot\run.ps1" spring-boot:run
