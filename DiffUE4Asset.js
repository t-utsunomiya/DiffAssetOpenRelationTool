// DiffUE4Asset.exe ���Ăяo���X�N���v�g

var FileSystem = WScript.CreateObject("Scripting.FileSystemObject");
var Shell = WScript.CreateObject("WScript.Shell");

// UE4�Œ�`����Ă�t�@�C�����Ɏg���Ȃ������B
// FPaths::GetInvalidFileSystemChars() ���玝���Ă��܂����B
var InvalidFileSystemChars = "[/?:&\\\\*\"<>|%#@^]";

// �t�@�C������UE4�Ŏg���Ȃ��������g���Ă�������"."�ɒu�������܂��B
// �g���Ȃ������� FPaths::GetInvalidFileSystemChars() ���玝���Ă��܂����B
function MakeValidFileName(InFileName)
{
  InvalidCharsRe = new RegExp(InvalidFileSystemChars, "g");
  return InFileName.replace(InvalidCharsRe,".");
}

// �t�@�C�����̖����ȕ�����"-"�ɕύX���ē����t�H���_�ɃR�s�[����B
// �R�s�[��̃t�@�C�������܂ރp�X��߂�l�ŕԂ��B
function CopyFileWithoutInvalidChars(Path)
{
  ToFileName = MakeValidFileName(FileSystem.GetFileName(Path));
  ToFilePath = FileSystem.GetParentFolderName(Path) + "\\" + ToFileName;
  Shell.Run("attrib -r " + ToFilePath, 0, true);
  FileSystem.CopyFile(Path, ToFilePath, true);
  return ToFilePath;
}

// �t�@�C�����ɖ����ȕ������܂܂�Ă����ꍇ�̓t�@�C������ύX���ē����t�H���_�ɃR�s�[����
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
  // �t�@�C������ύX�����ゾ�Ƃ��܂��A�Z�b�g�������o���Ȃ��\��������̂�
  // �����ȕ�����ύX���ăR�s�[����O�̃t�@�C��������A�Z�b�g�������o���B
  // �Ⴆ�΁A�t�@�C������ aaa-bbb#123.uasset ���� aaa-bbb ���A�Z�b�g���Ȃ̂� aaa ���A�Z�b�g���Ƃ��Ă��܂����߁B
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
