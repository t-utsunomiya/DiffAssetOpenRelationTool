# DiffAssetOpenRelationTool

## 概要
TortoiseSVN などから DiffAssetOpen プラグインを開くための連携ツール

## 使い方
1. このリポジトリをローカルの適当なフォルダにコピーするかチェックアウトしてください。
2. 各環境に合わせて以下の設定を行ってください。

	### TortoiseSVN の場合
	TortoiseSVN の "Setting" - "Diff Viewer" - "Configure the program used for comparing different revisions of files" の Advanced を開いて以下の設定を追加してください。

	```
	Filename, extension or mini-type: .uasset
	External Program: wscript.exe "DiffUE4Asset.jsへのパス" %base %mine "^[^\.]+"
	```
	これは TortoiseSVN が保存する一時ファイル名の先頭から'.'までがアセット名になっている前提の設定です。
	（例: ファイル名が "NewBlueprint1.uasset-rev3.svn000.tmp.uasset" ならアセット名は "NewBlueprint1"）

	### TortoiseGit の場合
	"Setting" - "Diff Viewer" - "Configure the program used for comparing different revisions of files" の Advanced を開いて以下の設定を追加してください。

	```
	Extension: .uasset
	External Program: wscript.exe "DiffUE4Asset.jsへのパス" %base %mine "^[^-]+"
	```
	TortoiseGit が保存する一時ファイル名の先頭から'-'までがアセット名になっている前提の設定です。
	（例: ファイル名が "NewBlueprint1-3cc8e21.000.uasset" ならアセット名は "NewBlueprint1"）

3. 設定を終えたら TortoiseSVN のコミットログから .uasset ファイルをダブルクリックするなどして UE4 の DiffAsset ツールが開けます。

## 注意点
- 差分を見るときは UE4 を開いた状態で行ってください。

## 仕様ツール
- [AutoHotKey](https://www.autohotkey.com/) (v1.1.30.00) を使用しています。
