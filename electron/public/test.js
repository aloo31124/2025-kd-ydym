/**
 *
 */
var kd_postTarget;
var kd_timeoutId;
var kd_jsonString;
var kd_logininfo;

function kd_doSignatureData(kdMaker_Json){
    kd_jsonString = jsonString;
    kd_postTarget=window.open("http://localhost:16888/doPostMsg", "簽章中","height=200, width=200, left=100, top=20");
    timeoutId=setTimeout(kd_checkFinish,3500);
}

function kd_checkFinish(){
    if(kd_postTarget){
        kd_postTarget.close();
        alert("尚未安裝簽章元件");
    }
}

function kd_doLogin(jsonString){
    kd_jsonString = jsonString;
    kd_postTarget=window.open("http://localhost:16888/doPostMsg", "登入中","height=200, width=200, left=100, top=20");
    timeoutId=setTimeout(kd_checkFinish,3500);
}

//Kd App return message
function kd_receiveMessage(event)
{
    if(console) console.debug(event);

    //安全起見，這邊應填入網站位址檢查
    if(event.origin!="http://localhost:16888")
        return;
    try{
        var ret = JSON.parse(event.data);

        if(ret.func){
            kd_logininfo = ret;
            if(ret.status!="0"){
                alert(ret.message);
                kd_postTarget.close();
            }
            else if(ret.func=="getKdData"){
                clearTimeout(timeoutId);
                var json= JSON.parse(kd_jsonString);
                kd_postTarget.postMessage(json,"*");
            }else if(ret.func=="doSignatureFinsh"){
                //請自行在該頁面定義kd_doSignatureFinsh()
                kd_doSignatureFinsh(ret);
                kd_postTarget.close();
            }else if(ret.func=="getLoginInfo"){ //憑證登入
                //請自行在該頁面定義login()
                loginData(ret);
                kd_postTarget.close();
            }
        }else{
            if(console) console.error("no func");
        }
    }catch(e){
        //errorhandle
        if(console) console.error(e);
    }
}

if (window.addEventListener) {
    window.addEventListener("message", kd_receiveMessage, false);
}