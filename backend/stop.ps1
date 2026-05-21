# Stop whatever is listening on the backend port (default 8080)
$port = if ($env:PORT) { $env:PORT } else { 8080 }
$lines = netstat -ano | Select-String ":$port\s" | Select-String "LISTENING"
$pids = $lines | ForEach-Object {
    if ($_ -match '\s+(\d+)\s*$') { [int]$Matches[1] }
} | Sort-Object -Unique

if (-not $pids) {
    Write-Host "No process listening on port $port."
    exit 0
}

foreach ($procId in $pids) {
    Write-Host "Stopping PID $procId (port $port)..."
    Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
}

Start-Sleep -Seconds 2
Write-Host "Port $port should be free. Run .\run.ps1 spring-boot:run to start the backend."
