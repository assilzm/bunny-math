$ErrorActionPreference = 'Stop'
$ProjectPath = Split-Path -Parent $PSScriptRoot
$NodePath = (Get-Command node.exe).Source
$VitePath = Join-Path $ProjectPath 'node_modules/vite/bin/vite.js'
$LogPath = Join-Path $ProjectPath '.preview.log'
$ErrorPath = Join-Path $ProjectPath '.preview-error.log'
$PreviewProcess = Start-Process -FilePath $NodePath -ArgumentList @($VitePath, '--host', '127.0.0.1', '--port', '5173', '--strictPort') -WorkingDirectory $ProjectPath -WindowStyle Hidden -RedirectStandardOutput $LogPath -RedirectStandardError $ErrorPath -PassThru
Write-Output "Preview PID: $($PreviewProcess.Id)"
Write-Output 'http://127.0.0.1:5173'
