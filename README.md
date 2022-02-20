# DiffAssetOpenRelationTool

## 概要
TortoiseSVN などから DiffAssetOpen プラグインを開くための連携ツール

## 使い方
1. このリポジトリをローカルの適当なフォルダにコピーするかチェックアウトしてください。
2. 各環境に合わせて以下の設定を行ってください。

	### TortoiseSVN の場合
	TortoiseSVN の "Setting" - "Diff Viewer" - "Configure the program used for comparing different revisions of files" の Advanced をクリックしてください。
	![Usage_01](https://github.com/t-utsunomiya/DiffAssetOpenRelationTool/blob/master/ReadmeResource/Usage_01.png "使い方01")  
	.uasset の設定を追加するために Add をクリックしてください。
	![Usage_02](https://github.com/t-utsunomiya/DiffAssetOpenRelationTool/blob/master/ReadmeResource/Usage_02.png "使い方02")  
	以下を設定して OK をクリックしてください。
	```
	Filename, extension or mime-type: .uasset
	External Program: wscript.exe "DiffUE4Asset.jsへのパス" %base %mine "^[^\.]+"
	```
	![Usage_03](https://github.com/t-utsunomiya/DiffAssetOpenRelationTool/blob/master/ReadmeResource/Usage_03.png "使い方03")  
	
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

	### Perforce の場合
	"編集" - "プリファレンス" を開いて Diff の"比較アプリケーションを拡張子で指定"に uasset の設定を追加します。
	を開いて以下の設定を追加してください。

	```
	拡張子: .uasset
	アプリケーション: wscript.exe
	引数: "DiffUE4Asset.jsへのパス" %1 %2 ^[^\#]+
	```
	Perforce が保存する一時ファイル名の先頭から'#'までがアセット名になっている前提の設定です。
	（例: ファイル名が "NewBlueprint1#1.uasset" ならアセット名は "NewBlueprint1"）
	うまく動かなかったときに wscript.exe へのパスをフルパスで書くと動くことがありました。

3. 設定を終えたら TortoiseSVN のコミットログから .uasset ファイルをダブルクリックするなどして UE4 の DiffAsset ツールが開けます。

[![](https://img.youtube.com/vi/PoC-79Rl0C0/0.jpg)](https://www.youtube.com/watch?v=PoC-79Rl0C0)
## 注意点
- 差分を見るときは UE4 を開いた状態で行ってください。

## 主な使用ツール
- [AutoHotKey](https://www.autohotkey.com/) (v1.1.30.00) を使用しています。
