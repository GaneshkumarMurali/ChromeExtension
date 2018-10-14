chrome.runtime.sendMessage({popupOpen: true});
var screen;
chrome.extension.onMessage.addListener(function(request,sender,sendResponse){
    switch(request.method){
        case 'setScreenshotUrl':
        document.getElementById('target').src = request.data;
        sendResponse({result: 'success'});
        screen=request.data;
    }
});
var btn=document.getElementById('createBtn');
if(btn){
    console.log('Button is loaded');
    btn.addEventListener('click',serviceNowAPICall);
}

function serviceNowAPICall(){
    var callerId = document.getElementById('userid').value;
    var shortDescription = document.getElementById('description').value;
    if(callerId =="" || shortDescription == ""){
        document.getElementById('message').innerHTML="User ID and Issue Description are required fields."
        return;
    }
    else{
        chrome.tabs.query({active:true, lastFocusedWindow: true}, function(tabs){
            document.getElementById('createBtn').disabled=true;
            var tab = tabs[0];
            var tabURL=tab.url;
            document.getElementById('response').innerHTML="Please wait,, ticket is being created";
            var requestBody="{\"assignment_group\":\"Chrome Extension\",\"caller_id\":\""+callerId+"\",\"short_description\":\""+shortDescription+"\",\"work_notes\":\""+"Application URL is:"+tabURL+"\"}";
            try{
                var client=new XMLHttpRequest();
                client.open("post","https://dev69618.service-now.com/api/now/table/incident?sysparm_fields=number%2Csys_id&sysparm_limit=1");
                client.setRequestHeader('Accept','application/json');
                client.setRequestHeader('Content-Type', 'application/json');
                client.setRequestHeader('Authorization','Basic '+btoa('admin'+':'+'Snow!123'));
                client.onreadystatechange=function(){
                    if(this.readyState==this.DONE){
                        var httpResponse = JSON.parse(this.response);
                        document.getElementById('response').innerHTML="Your Incident number is :" +httpResponse["result"].number;
                        var sysID = httpResponse["result"].sys_id;
                        chrome.runtime.sendMessage({msg: "startFunc", image: screen, ticketID: sysID});
                    }
                };
                client.send(requestBody);
            }
            catch(ex){
                document.getElementById('message').innerHTML="An erroe occurred. Please try again later"
            }                                                                         
        });
    }
}
