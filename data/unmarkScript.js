// Quando riceve il segnale "execUnmark" rimuove gli elementi che evidenziano l'elemento corrispondente
self.port.on("execUnmark", function(payload) {
  mark = document.getElementsByName("mark-"+payload.locId);
  tag = document.getElementsByName("tag-"+payload.locId);
  nElementi = mark.length;
  for(i = nElementi-1; i >= 0; i--){
  	tag[i].parentNode.removeChild(tag[i]);
  	mark[i].parentNode.removeChild(mark[i]);  	  	  	
  }  	
});
