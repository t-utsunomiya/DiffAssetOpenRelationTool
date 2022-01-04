// DiffUE4Asset.exe を呼び出すスクリプト

var FileSystem = WScript.CreateObject("Scripting.FileSystemObject");
var Shell = WScript.CreateObject("WScript.Shell");

// UE4で定義されてるファイル名に使えない文字。
// FPaths::GetInvalidFileSystemChars() から持ってきました。
var InvalidFileSystemChars = "[/?:&\\\\*\"<>|%#@^]";

// ファイル名にUE4で使えない文字が使われていた時は"."に置き換えます。
// 使えない文字は FPaths::GetInvalidFileSystemChars() から持ってきました。
function MakeValidFileName(InFileName)
{
  InvalidCharsRe = new RegExp(InvalidFileSystemChars, "g");
  return InFileName.replace(InvalidCharsRe,".");
}

// ファイル名の無効な文字を"-"に変更して同じフォルダにコピーする。
// コピー先のファイル名を含むパスを戻り値で返す。
function CopyFileWithoutInvalidChars(Path)
{
  ToFileName = MakeValidFileName(FileSystem.GetFileName(Path));
  ToFilePath = FileSystem.GetParentFolderName(Path) + "\\" + ToFileName;
  Shell.Run("attrib -r " + ToFilePath, 0, true);
  FileSystem.CopyFile(Path, ToFilePath, true);
  return ToFilePath;
}

// ファイル名に無効な文字が含まれていた場合はファイル名を変更して同じフォルダにコピーする
function CopyFileIfInvalidChars(Path, Output)
{
  var FileName = FileSystem.GetFileName(Path);
  if (FileName.match(InvalidFileSystemChars))
  {
    ToFileName = MakeValidFileName(FileName);
    ToFilePath = FileSystem.GetParentFolderName(Path) + "\\" + ToFileName;
    Shell.Run("attrib -r " + ToFilePath, 0, true);
    FileSystem.CopyFile(Path, ToFilePath, true);
    Output.FilePath = ToFilePath;
    Output.FileName = ToFileName;
    return true;
  }
  return false;
}

var Args = WScript.Arguments;
if (Args.length != 3)
{
  WScript.Echo("Usage: [CScript | WScript] DiffUE4Asset.js base new pattern");
  WScript.Quit(1);
}

var DiffArg = {
  Left:{Path: Args(0), AssetName: ""},
  Right:{Path: Args(1), AssetName: ""}};
var AssetNameRe = new RegExp(Args(2));

for (Key in DiffArg)
{
  // ファイル名を変更した後だとうまくアセット名を取り出せない可能性があるので
  // 無効な文字を変更してコピーする前のファイル名からアセット名を取り出す。
  // 例えば、ファイル名が aaa-bbb#123.uasset だと aaa-bbb がアセット名なのに aaa をアセット名としてしまうため。
  DiffArg[Key].AssetName = AssetNameRe.exec(FileSystem.GetFileName(DiffArg[Key].Path));
  if (FileSystem.GetFileName(DiffArg[Key].Path).match(InvalidFileSystemChars))
  {
    DiffArg[Key].Path = CopyFileWithoutInvalidChars(DiffArg[Key].Path);
  }
}

var AppPath = WScript.ScriptFullName.substr(0, WScript.ScriptFullName.length - WScript.ScriptName.length);
var Command = "\"" + AppPath + "DiffUE4Asset.exe\" " + DiffArg["Left"].Path + " " + DiffArg["Right"].Path + " " + DiffArg["Left"].AssetName + " " + DiffArg["Right"].AssetName;
var retCode = Shell.Run(Command, 0, true);
WScript.Quit(retCode);
