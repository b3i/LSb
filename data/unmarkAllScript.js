// Quando riceve il segnale "execUnmarkAll" rimuove tutti i mark e i tad dalla pagina
 self.port.on("execUnmarkAll", function() {
	var tag = document.getElementsByClassName("locTag");
    while(tag.length > 0){
        tag[0].parentNode.removeChild(tag[0]);
    }
    var mark = document.getElementsByClassName("locMark");
    while(mark.length > 0){
        mark[0].parentNode.removeChild(mark[0]);
    }
});