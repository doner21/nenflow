@echo off
REM install.bat — Install the Nenflow PEV plugin globally for Claude Code
REM Supports: Windows
REM
REM Usage: Double-click install.bat, or run from Command Prompt / PowerShell:
REM   cd path\to\nenflow
REM   install.bat

setlocal enabledelayedexpansion

set PLUGIN_DIR=%~dp0

echo =^> Installing Nenflow PEV plugin...
echo.

REM 1. Create %USERPROFILE%\.claude\commands\ if needed
mkdir "%USERPROFILE%\.claude\commands" 2>nul
echo [1/2] Checked %USERPROFILE%\.claude\commands\

REM 2. Copy all command files
copy /Y "%PLUGIN_DIR%commands\nenflow.md" "%USERPROFILE%\.claude\commands\nenflow.md" >nul
copy /Y "%PLUGIN_DIR%commands\nenflow-planner.md" "%USERPROFILE%\.claude\commands\nenflow-planner.md" >nul
copy /Y "%PLUGIN_DIR%commands\nenflow-executor.md" "%USERPROFILE%\.claude\commands\nenflow-executor.md" >nul
copy /Y "%PLUGIN_DIR%commands\nenflow-verifier.md" "%USERPROFILE%\.claude\commands\nenflow-verifier.md" >nul
copy /Y "%PLUGIN_DIR%commands\nenflow-researcher.md" "%USERPROFILE%\.claude\commands\nenflow-researcher.md" >nul
copy /Y "%PLUGIN_DIR%commands\pev-loop-human-handoff-v3.md" "%USERPROFILE%\.claude\commands\pev-loop-human-handoff-v3.md" >nul
echo [2/2] Copied 6 command files to %USERPROFILE%\.claude\commands\

echo.
echo =^> Installation complete.
echo.
echo     Commands installed:
echo       /nenflow             - run the PEV orchestrator
echo       /nenflow-planner     - Planner role (used by orchestrator)
echo       /nenflow-executor    - Executor role (used by orchestrator)
echo       /nenflow-verifier    - Verifier role (used by orchestrator)
echo       /nenflow-researcher  - Researcher role (optional phase)
echo.
echo     Restart Claude Code to activate the commands.
echo.
echo     Then add the nenflow\ directory to each project you want to use it in:
echo       xcopy /E /I "%PLUGIN_DIR%nenflow" "C:\path\to\your-project\nenflow"
echo.

endlocal
