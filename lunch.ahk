#NoEnv
SetWorkingDir %A_ScriptDir%

; GUI Creation
Gui, Add, Button, x10 y50 w200 h30 gLaunchNext, Launch Next.js
Gui, Add, Button, x10 y90 w200 h30 gLaunchLaravel, Launch Laravel
Gui, Add, Button, x10 y130 w200 h30 gLaunchTerminal, Launch Terminal
Gui, Add, Button, x10 y170 w200 h30 gLaunchBrowser, Launch Browser
Gui, Add, Button, x10 y10 w200 h30 gLaunchAll, Launch All
Gui, Add, Button, x10 y210 w200 h30 gKillAll, Kill All
Gui, Add, Text, x10 y250 w200 h30 vStatusText, Ready
Gui, Show, w220 h290, Workspace Launcher


; Set button colors
GuiControl, +Background%Green%, LaunchAllBtn
GuiControl, +Background%Red%, KillAllBtn


return

GuiClose:
ExitApp

LaunchAll:
    Gosub, LaunchNext
    Gosub, LaunchLaravel
    Gosub, LaunchTerminal
    Gosub, LaunchBrowser
    GuiControl,, StatusText, All components launched
return

LaunchNext:
    if (LaunchVSCode("next-meta"))
        GuiControl,, StatusText, Next.js project launched
return

LaunchLaravel:
    if (LaunchVSCode("laravel-meta", true))
        GuiControl,, StatusText, Laravel project launched
return

LaunchTerminal:
    LaunchWindowsTerminal()
    GuiControl,, StatusText, Terminal launched
return

LaunchBrowser:
    LaunchChrome()
    GuiControl,, StatusText, Browser launched
return

KillAll:
    KillProcess("Code.exe")
    KillProcess("Code - Insiders.exe")
    KillProcess("WindowsTerminal.exe")
    KillProcess("chrome.exe")
    KillProcess("cmd.exe")
    KillProcess("conhost.exe")
    KillProcess("node.exe")
    KillProcess("php.exe")
    GuiControl,, StatusText, All processes killed
return

; Functions

LaunchVSCode(dir, useInsiders := false) {
    codePath := useInsiders ? FindCodeInsiders() : FindVSCode()
    if (codePath && DirExist(dir)) {
        Run, "%codePath%" "%A_WorkingDir%\%dir%"
        return true
    }
    MsgBox, Error: Could not launch VS Code for %dir%
    return false
}

LaunchWindowsTerminal() {
    terminalPath := "wt.exe"
    nextCommand := "cd /d """ A_WorkingDir "\next-meta"" && npm run dev"
    laravelCommand := "cd /d """ A_WorkingDir "\laravel-meta"" && php artisan serve"
    terminalCommand := terminalPath . " new-tab -p ""Command Prompt"" cmd.exe /k " . nextCommand . " `; new-tab -p ""Command Prompt"" cmd.exe /k " . laravelCommand
    Run, %terminalCommand%
}

LaunchChrome() {
    chromePath := "C:\Users\Legion\AppData\Local\Google\Chrome SxS\Application\chrome.exe"
    if (FileExist(chromePath)) {
        userDataDir := "C:\Users\Legion\AppData\Local\Google\Chrome SxS\User Data"
        Run, "%chromePath%" --user-data-dir="%userDataDir%" --profile-directory=Default http://localhost:3000
    } else {
        MsgBox, Error: Chrome Canary not found.
    }
}

FindVSCode() {
    codePath := "C:\Users\" A_UserName "\AppData\Local\Programs\Microsoft VS Code\Code.exe"
    if (!FileExist(codePath))
        codePath := A_ProgramFiles "\Microsoft VS Code\Code.exe"
    return FileExist(codePath) ? codePath : ""
}

FindCodeInsiders() {
    codePath := "C:\Users\" A_UserName "\AppData\Local\Programs\Microsoft VS Code Insiders\Code - Insiders.exe"
    if (!FileExist(codePath))
        codePath := A_ProgramFiles "\Microsoft VS Code Insiders\Code - Insiders.exe"
    return FileExist(codePath) ? codePath : FindVSCode()
}

DirExist(path) {
    return InStr(FileExist(path), "D")
}

KillProcess(processName) {
    Process, Close, %processName%
}