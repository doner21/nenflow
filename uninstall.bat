@echo off
REM uninstall.bat — Remove the Nenflow PEV plugin from Claude Code
REM Supports: Windows
REM
REM Usage: Double-click uninstall.bat, or run from Command Prompt / PowerShell

setlocal

echo =^> Uninstalling Nenflow PEV plugin...
echo.

set COMMANDS_DIR=%USERPROFILE%\.claude\commands

for %%f in (nenflow.md nenflow-planner.md nenflow-executor.md nenflow-verifier.md nenflow-researcher.md pev-loop-human-handoff-v3.md) do (
    if exist "%COMMANDS_DIR%\%%f" (
        del /Q "%COMMANDS_DIR%\%%f"
        echo Removed %COMMANDS_DIR%\%%f
    ) else (
        echo Not found ^(skipping^): %COMMANDS_DIR%\%%f
    )
)

echo.
echo =^> Uninstall complete.
echo.
echo     Note: the nenflow\ directory inside your projects was NOT removed.
echo     To remove it from a project, delete the nenflow\ folder manually.
echo.
echo     Restart Claude Code to deactivate the removed commands.
echo.

endlocal
