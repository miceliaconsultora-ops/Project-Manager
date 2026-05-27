# Registrar Tarea Programada en Windows para Sincronización Diaria
# Este script crea una tarea en el Programador de Tareas de Windows.
# Se recomienda ejecutarlo en una terminal de PowerShell.

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$TargetScript = Join-Path $ScriptDir "push_changes.ps1"

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "Registrando Tarea Programada en Windows..." -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan

# 1. Definir la acción (Ejecutar powershell.exe oculto con el script de push)
$Action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$TargetScript`""

# 2. Definir el disparador (Diariamente a las 19:00)
$Trigger = New-ScheduledTaskTrigger -Daily -At 7pm

# 3. Definir configuraciones adicionales (ejecutar lo antes posible si se pierde la hora, etc.)
$Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

# 4. Registrar la tarea en el contexto del usuario actual (no requiere privilegios de Administrador)
$TaskName = "ProjectManager-DailySync"
try {
    Register-ScheduledTask -TaskName $TaskName -Action $Action -Trigger $Trigger -Settings $Settings -Description "Sincroniza automáticamente el Dashboard de Project Manager y sube cambios a GitHub diariamente a las 19:00." -Force | Out-Null
    
    Write-Host "¡Tarea programada registrada exitosamente!" -ForegroundColor Green
    Write-Host "Detalles de la tarea:" -ForegroundColor Gray
    Write-Host "  Nombre: $TaskName" -ForegroundColor Gray
    Write-Host "  Hora: Todos los días a las 19:00 (7:00 PM)" -ForegroundColor Gray
    Write-Host "  Acción: Ejecutar $TargetScript" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Para verificar o ejecutar manualmente la tarea, abre 'taskschd.msc' en Windows o corre:" -ForegroundColor Gray
    Write-Host "  Start-ScheduledTask -TaskName `"$TaskName`"" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Para eliminar la tarea si ya no la necesitas, corre:" -ForegroundColor Gray
    Write-Host "  Unregister-ScheduledTask -TaskName `"$TaskName`" -Confirm:`$false" -ForegroundColor Red
} catch {
    Write-Error "Error al registrar la tarea programada: $_"
    Write-Host "Si el comando falló, intenta abrir PowerShell como Administrador y vuelve a ejecutar este script." -ForegroundColor Yellow
}
Write-Host "==============================================" -ForegroundColor Cyan
