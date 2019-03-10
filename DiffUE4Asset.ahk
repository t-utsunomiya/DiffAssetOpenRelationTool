; UE4 の DiffAssetOpen プラグインのウィンドウにファイル名などの情報を渡すための ahk スクリプト.

#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
; #Warn  ; Enable warnings to assist with detecting common errors.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.

ArgCount = %0%
If(ArgCount != 4)
{
	MsgBox Usage: %a_scriptname% LeftPath RightPath LeftAssetName RightAssetName
	ExitApp
}
LeftPath = %1%
RightPath = %2%
LeftAssetName = %3%
RightAssetName = %4%
DiffAssetWindowTitle := "DiffAssetOpenDialog"
UE4WindowClass := "UnrealWindow"
UE4WindowExe := "UE4Editor.exe"

OpenDiffAsset(ByRef LeftPath, ByRef RightPath, ByRef LeftAssetName, ByRef RightAssetName)
{
	BlockInput, on
	SendInput, !{l down}{l up}^{a down}{a up}%LeftPath%
	SendInput, !{r down}{r up}^{a down}{a up}%RightPath%
	SendInput, !{e down}{e up}^{a down}{a up}%LeftAssetName%
	SendInput, !{i down}{i up}^{a down}{a up}%RightAssetName%
	SendInput, {Tab}{Enter}
	BlockInput, off
}

OpenDialog()
{
	SendInput ^!+{d down}{d up}
}

SetTitleMatchMode 3 ; タイトル検索方法は完全一致を指定
; UE4Editor が立ち上がっているかどうか
IfWinExist ahk_class %UE4WindowClass% ahk_exe %UE4WindowExe%
{
	; DiffAssetOpenDialog が開いているかどうか
	IfWinExist, %DiffAssetWindowTitle% ahk_class %UE4WindowClass% ahk_exe %UE4WindowExe%
	{
		WinActivate %DiffAssetWindowTitle% ahk_class %UE4WindowClass% ahk_exe %UE4WindowExe%
		OpenDiffAsset(LeftPath, RightPath, LeftAssetName, RightAssetName)
	}
	Else
	{
		WinActivate ahk_class %UE4WindowClass% ahk_exe %UE4WindowExe%
		OpenDialog()
		WinWaitActive, %DiffAssetWindowTitle% ahk_class %UE4WindowClass% ahk_exe %UE4WindowExe%, , 0
		If ErrorLevel <> 0
		{
			Msgbox, %DiffAssetWindowTitle% が開きませんでした。`n UE4 の DiffAssetOpen プラグインを有効にして、ショートカットキー(Ctrl+Alt+Shift+d)で%DiffAssetWindowTitle% が開く設定になっているか確認してください。
		}
		Else
		{
			WinActivate %DiffAssetWindowTitle% ahk_class %UE4WindowClass% ahk_exe %UE4WindowExe%
			OpenDiffAsset(LeftPath, RightPath, LeftAssetName, RightAssetName)
		}
	}
}
Else
{
	Msgbox, 実行中の UE4Editor が見つかりませんでした。UE4Editor が起動していなければ立ち上げてから実行してください。
}

Return
