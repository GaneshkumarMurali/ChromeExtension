chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse){
        try{
            if(request.msg == "startFunc") {
                console.log('Attachment');
                attachmentAPICall(request.image,request.ticketID);
            }
            else if(request.popupOpen){
                chrome.tabs.captureVisibleTab(function(url){
                    chrome.extension.sendMessage({method: 'setScreenshotUrl',data: url},function(response) {});
                });
            }
        }
        catch(ex) {
            console.log(ex);
        }
    }
);

function attachmentAPICall(dataURI, sysId){
    try{
        var BASE64_MARKER =';base64,';
        var base64Index = dataURI.indexOf(BASE64_MARKER)+BASE64_MARKER.length;
        var base64 = dataURI.substring(base64Index);
        var raw = window.atob(base64);
        var rawLength=raw.length;
        var array = new Uint8Array(new ArrayBuffer(rawLength));
        for(i=0;i<rawLength;i++){
            array[i]=raw.charCodeAt(i);
        }
        var requestBody=array;
        var client=new XMLHttpRequest();
        client.open("post","https://dev69618.service-now.com/api/now/attachment/file?table_name=incident&table_sys_id=" + sysId + "&file_name=Screenshot_"+sysId+".jpg");
        client.setRequestHeader('Accept','application/json');
        client.setRequestHeader('Content-Type', 'image/jpeg');
        client.setRequestHeader('Authorization','Basic '+btoa('admin'+':'+'Snow!123'));
        client.onreadystatechange=function(){
            if(this.readyState == this.DONE){
                var httpResponse = JSON.parse(this.response);
            }
        };
        client.send(requestBody);
    }
    catch(ex) {
        console.log(ex);
    }
}

// function takeScreenshot(sysId){
//     chrome.tabs.captureVisibleTab(function (screenshotUrl){
//         console.log(screenshotUrl);
//         try{
//             attachmentAPICall(screenshotUrl,sysId);
//         }
//         catch(ex) {
//             console.log(ex);
//         }
//     });
// };
