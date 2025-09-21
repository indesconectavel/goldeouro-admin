@echo off
REM SISTEMA DE BACKUP AUTOMATIZADO - GOL DE OURO ADMIN
REM Versão: 1.0.0
REM Data: 09/01/2025
REM 
REM Interface Windows para backup e restauração

setlocal enabledelayedexpansion

REM Configurações
set "PROJECT_ROOT=%~dp0.."
set "BACKUP_DIR=%PROJECT_ROOT%\backups"
set "TIMESTAMP=%date:~6,4%-%date:~3,2%-%date:~0,2%_%time:~0,2%-%time:~3,2%-%time:~6,2%"
set "TIMESTAMP=%TIMESTAMP: =0%"

:menu
cls
echo.
echo  🛡️  SISTEMA DE BACKUP - GOL DE OURO ADMIN
echo  =========================================
echo.
echo  1. Criar Backup Completo
echo  2. Criar Backup Rápido
echo  3. Listar Backups
echo  4. Restaurar Backup
echo  5. Restauração Rápida
echo  6. Sair
echo.
set /p choice="Escolha uma opção (1-6): "

if "%choice%"=="1" goto create_backup
if "%choice%"=="2" goto quick_backup
if "%choice%"=="3" goto list_backups
if "%choice%"=="4" goto restore_backup
if "%choice%"=="5" goto quick_restore
if "%choice%"=="6" goto exit
goto menu

:create_backup
echo.
echo  🚀 Criando backup completo...
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0backup.ps1" create
echo.
pause
goto menu

:quick_backup
echo.
echo  ⚡ Criando backup rápido...
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0backup.ps1" quick
echo.
pause
goto menu

:list_backups
echo.
echo  📁 Listando backups disponíveis...
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0backup.ps1" list
echo.
pause
goto menu

:restore_backup
echo.
echo  🔄 Restauração de backup...
echo.
set /p backup_name="Digite o nome do backup para restaurar: "
if "%backup_name%"=="" (
    echo ❌ Nome do backup não pode estar vazio
    pause
    goto menu
)
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0backup.ps1" restore "%backup_name%"
echo.
pause
goto menu

:quick_restore
echo.
echo  🚀 Restauração rápida (último backup)...
echo.
set /p confirm="Tem certeza? (s/n): "
if /i not "%confirm%"=="s" goto menu
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0quick-restore.ps1"
echo.
pause
goto menu

:exit
echo.
echo  👋 Saindo do sistema de backup...
echo.
exit /b 0
