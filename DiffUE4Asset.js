// DiffUE4Asset.exe ���Ăяo���X�N���v�g
// �t�@�C��������A�Z�b�g�������o�����������̃X�N���v�g�ōs���Ă��܂��B

var appPath = WScript.ScriptFullName.substr(0, WScript.ScriptFullName.length - WScript.ScriptName.length);

objArgs = WScript.Arguments;
num = objArgs.length;
if (num != 3)
{
    WScript.Echo("Usage: [CScript | WScript] DiffUE4Asset.js base new pattern");
    WScript.Quit(1);
}
sLeftPath = objArgs(0);
sRightPath = objArgs(1);
sPattern = objArgs(2);

var fso = WScript.CreateObject("Scripting.FileSystemObject");
var re = new RegExp(sPattern);
sLeftAssetName = re.exec(fso.GetFileName(sLeftPath));
sRightAssetName = re.exec(fso.GetFileName(sRightPath));

wsShell = WScript.createObject("WScript.Shell");
sCommand = "\"" + appPath + "DiffUE4Asset.exe\" " + sLeftPath + " " + sRightPath + " " + sLeftAssetName + " " + sRightAssetName
retCode = wsShell.Run(sCommand, 0, true);
WScript.Quit(retCode);
