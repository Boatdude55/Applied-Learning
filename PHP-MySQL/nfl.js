var i=0;
var dropMenu = document.getElementById("activate-drop-menu");
var currRoster = document.getElementById("CurrRoster");
    
    dropMenu.addEventListener("click",showMenuOpt);
function showMenuOpt(){
            var x = document.getElementById("show");
            var y = document.getElementById("hide");
            if(x.style.display == 'inline'){
                x.style.display = 'none';
                y.style.display = 'inline';
                document.getElementById("toggle").style.display = 'block';
            }else{
                y.style.display = 'none';
                x.style.display = 'inline';
                document.getElementById("toggle").style.display = 'none';
            }
            var posRequest = document.getElementsByClassName("tableBtn");
    for (i =0; i<posRequest.length; i++) {
        posRequest[i].addEventListener("click",PosttoPHP);
    }
    SetClickNewPlayerBtn();
}

function SetClickNewPlayerBtn(){
    var Btn = document.getElementsByClassName("playerBtn");
    for(i=0; i<Btn.length; i++){
        Btn[i].addEventListener("click",UpdateRoster);
    }
}

function UpdateRoster(){
    var addplayerBtn = this.cloneNode(true);
    currRoster.appendChild(addplayerBtn);
}
function PosttoPHP(){
    var xmlhttp=new XMLHttpRequest();
    xmlhttp.onreadystatechange=function() {
        if (this.readyState==4 && this.status==200) {
          document.getElementById("statsArea").innerHTML=this.responseText;
        }
  };
          xmlhttp.open("GET","RequestDB.php?q="+this.innerHTML,true);
          xmlhttp.send();
}