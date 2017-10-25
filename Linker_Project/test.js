var submit = document.getElementById('search_btn');
submit.addEventListener('click', PosttoPHP, true);



//cant use for d3 testing
function PosttoPHP(){
    var query = document.getElementById('query');
    var xmlhttp=new XMLHttpRequest();
    xmlhttp.onreadystatechange=function() {
        if (this.readyState==4 && this.status==200) {
            try{
                document.getElementById('main_content').contentWindow.document.body.innerHTML=this.responseText;
            }catch(e){
                console.log(e.message);                // "Hello"
                console.log(e.name);                   // "SyntaxError"
                console.log(e.fileName);               // "someFile.js"
                console.log(e.lineNumber);             // 10
            }
          
        }
  };
          xmlhttp.open("GET","test.php?q="+query.value,true);
          xmlhttp.send();
}
