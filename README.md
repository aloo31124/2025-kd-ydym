康大公文行動簽核
kangDa Official Authorize (oa)

[開發工具]
1. Visual Studio Code ( https://code.visualstudio.com/ )
   + Debugger for Chrome

2. NodeJs 8.11.1 LTS ( https://nodejs.org/ )

[debug]
1. npm install -g lite-server
2. 啟webserver(其他方式也可以，如:IIS)
cd touch/webserver
npm start
3. Chrome debug

[ Framework - Sencha Touch ]
http://docs.sencha.com/touch/2.4/
http://docs.sencha.com/touch/2.4/2.4.2-apidocs/

Sencha Touch教學
Web App 行動開發http://blog.toright.com/posts/3214
威老 http://www.cnblogs.com/weilao/category/314014.html
Sencha Touch中文 http://extjs.org.cn/sencha-touch
随它去吧 http://www.cnblogs.com/dowinning/

[ 資料夾配置 ]
kd 模擬管理介面：doc.html正式機，doctest.html測試機
oa 主程式
build 打包/離線版
webserver node 服務器

[oa] 
app         App相關
resources   引用資源
thirdparty  第3方引用
store       暫存器
web         測試及網站相關(node.js)
kdconfig.js 共用設定
app.json    相依元件

[app]
主要為 model / view / controller (mvc) ／ store

- model
model/wk/{unit}       文稿模型 (統一定義在 OA.common.DIMgr)
model/seal/{unit}.js  核章模型

- model/wk 各文稿模式
Post paras 請求參數
Proxy      Rest 代理
Mapping    資料轉換
Layout     版面配製

client - web client 請求資料
common - 共用
componets - 元件，主要是 paper.js (渲染文稿)
form  - 表單 (不強制MVC，以個別檔案為主，common.Fields註記欄位、common.Funcs註記功能)

[公文基礎格式]
DI => WK  製作
SI => VI  簽核
SW        交換

[build] 
testing 編成app.js
offline 離線版

[web編譯打包]

Sencha Cmd 6.2.2
https://www.sencha.com/products/extjs/cmd-download/
http://cdn.sencha.com/cmd/6.2.2/jre/SenchaCmd-6.2.2-windows-64bit.zip
window 要增加環境變數 C:\Users\xxxx\bin\Sencha\Cmd\x.x.xx/..
railsinstaller-2.2.5

1	改版本	oa/app.js   qs.v =1.0.204
2	cd touch/oa
3	sencha app build testing
4	產出到touch/build/testing/oa
	線上部署AP24
	ftp to  /home/docadmin/temp/oa
	ssh docadmin@172.25.130.24
	cd /home/docadmin/temp
	sh copyOA_online.sh

[離線打包]
cd touch/build/offline
npm install -g electron
npm install electron-packager --save-dev
npm install electron-winstaller --save-dev

1	改版本
	oa/app.js   qs.v =1.0.205
	build/offline package.json  version = 1.0.205

2	更改 app.json
    [mac]
	"testing": {
    "output": {
      "base": "/Users/apple/touch/build/offline/oa"
    }}

    [window]
    "testing": {
        "output": {
          "base": "D:\\touch\\build\\offline\\oa"
        }}

3	編譯產出到 touch/build/offline/oa 資料夾
	cd touch/oa
	sencha app build testing

	注意 build/offline/oa/kdconfig.js
    要指向正式機，host_testing_ssl: 'doc.gov.taipei/tcqb/rest/'

4	打包
	【MAC】
	cd touch/build/offline
	npm run build_mac_production
	壓成zip，放在 darwin/1.0.xx/oaoffline-darwin-x64.zip

	[mac for window]
	open wine

	【Window】
	cd touch/build/offline
	
	x86/ia32/x64
	npm run build_win32_production  
	node winpack32_production.js
	
                                                                                                        

ICO圖編譯，要編譯sass
1	http://fontawesome.io/ 找
2	/touch/resources/sass/sencha-touch.scss 增加ICO
3	cd touch
4	sencha compass compile resources/sass

地址簿更新
cd touch/build/offline
electron main.js testing g2b

[開發參考]
JavasScript 中被普遍使用的風格指南
https://github.com/jigsawye/javascript/tree/master/es5

svg dom 請參閱
http://www.w3schools.com/dom/default.asp
http://www.w3.org/TR/SVG/svgdom.html
https://developer.mozilla.org/zh-TW/docs/Web/SVG

【追蹤修訂】
資料來源  OA.common.Utils.getKDRichTextBlock : MultiFormat
動態排版  OA.components.Paper.typesetting()


Debug

debugger;
console.log('here');