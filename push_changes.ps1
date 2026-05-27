# Sincronizar Dashboard y Subir Cambios a GitHub
# Este script es ejecutado automáticamente por el Programador de Tareas o manualmente.

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "Iniciando proceso de sincronización..." -ForegroundColor Cyan
Write-Host "Fecha: (Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Cyan
Write-Host "Directorio: $ScriptDir" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan

# 1. Ejecutar la sincronización Python
try {
    Write-Host "1. Ejecutando sync_projects.py..." -ForegroundColor Yellow
    python sync_projects.py
    if ($LASTEXITCODE -ne 0) {
        throw "La ejecución de sync_projects.py falló con código de salida $LASTEXITCODE"
    }
    Write-Host "Sincronización de base de datos finalizada correctamente." -ForegroundColor Green
} catch {
    Write-Error "ERROR durante la sincronización: $_"
    Exit 1
}

# 2. Operaciones Git
try {
    Write-Host "2. Iniciando operaciones de Git..." -ForegroundColor Yellow
    
    # Comprobar si hay cambios pendientes
    $status = git status --porcelain
    if ([string]::IsNullOrEmpty($status)) {
        Write-Host "No hay cambios pendientes para subir a GitHub. Todo al día." -ForegroundColor Green
        Exit 0
    }

    Write-Host "Cambios detectados. Agregando al commit..." -ForegroundColor Gray
    git add .

    $commitMsg = "Auto-update: Sincronización del Dashboard y documentación (" + (Get-Date -Format "yyyy-MM-dd HH:mm") + ")"
    Write-Host "Creando commit: '$commitMsg'..." -ForegroundColor Gray
    git commit -m $commitMsg

    Write-Host "Subiendo a GitHub (git push origin main)..." -ForegroundColor Yellow
    
    # Git escribe mensajes de progreso a stderr. Desactivamos temporalmente Action=Stop.
    $oldErrorAction = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    
    git push origin main
    $gitExitCode = $LASTEXITCODE
    
    $ErrorActionPreference = $oldErrorAction
    
    if ($gitExitCode -ne 0) {
        throw "git push falló con código de salida $gitExitCode"
    }

    Write-Host "==============================================" -ForegroundColor Green
    Write-Host "Proceso completado exitosamente." -ForegroundColor Green
    Write-Host "==============================================" -ForegroundColor Green
} catch {
    Write-Error "ERROR durante las operaciones de Git: $_"
    Exit 1
}
