function ajax(url, vars, callbackFunction){

var request = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("MSXML2.XMLHTTP.3.0");

request.open("POST", url, true);
request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); 

request.onreadystatechange = function(){

if (request.readyState == 4 && request.status == 200) {

if (request.responseText){

callbackFunction(request.responseText);
}
}
}
request.send(vars);
}