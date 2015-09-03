// array con i colori da assegnare ai vari locators (0 è il colore neutro usato per gli elementi non evidenziati)
var colors = ["#f3f3f3",
"#07e3f2", "#3302e1", "#f3433a", "#3193c0", "#c5f70a", "#923d6e", "#52fd0f",
"#2cb579", "#d9a722", "#706d28", "#fbe25f", "#4170af", "#b7b353", "#e38d5f",
"#be117a", "#6787b3", "#386029", "#580f46", "#d0ff1b", "#12ec27", "#3180da",
"#24b55a", "#5809be", "#61308b", "#9e6ae9", "#f73171", "#207ae1", "#fd2438", 
"#44a3c6", "#572e3f", "#3e7d8e", "#3c90ff", "#538bfe", "#56560b", "#0d8e37",
"#a543b6", "#f2a83e", "#d4ae2e", "#05ddaa", "#794876", "#f19ee5", "#da8f9f"
];

var curXml = ""; // salva l'xml corrente in caso di reload
var maxRows = 0 // massimo index delle righe della tabella locators

// gestione del caricamento/lettura del file xml
function handleFiles() { 
  $("#btnReloadTab").prop("disabled", false); 
  var selectedFile = document.getElementById("fileInput").files[0];
  var fileName = selectedFile.name;
  var reader  = new FileReader();
  if (selectedFile) {
    reader.readAsText(selectedFile);    
  }
  reader.onloadend = function () {     
    curXml = reader.result; 
    populateTable(reader.result);    
  }   
}




function populateTable(xmlContent){  
  $("#fileInput").val(""); 
  //table = $("#locTableBody"); 
  //table.empty();  
  xmlDoc = $.parseXML(xmlContent);  // converte il testo passato per parametro in xml
  xml = $(xmlDoc);  
  locators = xml.find("locator");  // trova tutti i locator nell'xml  
  
  // per ogni locator dell'xml richiede il conteggio delle istanze
  //table = $("#locTableBody"); 
  //var rows = table.children(); 
  i = maxRows+1; 
  locators.each(function(i){        
    tempType = $(this).attr("type");
    tempName = $.trim($(this).text());
    j = maxRows + 1 + i;     
    var locObj =  {locName : tempName, locType : tempType, nIndex : j}; 
    addon.port.emit("countInstances", locObj);
  });

}

function emptyTable(){
  table = $("#locTableBody"); 
  table.empty();
  addon.port.emit("unmarkAll"); 
  maxRows = 0;
}


// ogni volta che viene richiesto il conteggio delle istanze di un elemento viene chiamato countScript.js e inserito l'esito nella tabella
addon.port.on("instancesCounted", function(payload){          
  locName = payload.locName;
  locNameEscaped = locName.replace(/'/g, "&#39;");  // necessario perchè nei locators xpath e cssselectors sono presenti
  locType = payload.locType;
  j = payload.nIndex;
  locN = payload.locN;  
  table = $("#locTableBody"); 
  r = ""; 
  r +='<tr class=\'locTr unmarked\' index=\''+j+'\' id=\'tr-'+j+'\' type=\''+locType+'\' name=\''+locNameEscaped+'\' onclick=\'markLocator(\"'+locType+'\", \"'+locNameEscaped+'\", '+j+')\'>';
  r +="<td class=\"colorbox\"></td>";
  r +="<td>"+locType+"</td>"
  r +="<td>"+locName+"</td>";    
  //r +="<td>1</td>"; // TODO: segnalare se istanze previste e correnti non corrispondono
  r +="<td id=\"td-inst-"+j+"\">"+locN+"</td>";
  //r +='<td><input id=\'locCheck-'+j+'\' locType=\''+locType+'\' locName=\''+locNameEscaped+'\' type=\'checkbox\' onchange=\'markLocator(this, \"'+locType+'\",\"'+locNameEscaped+'\", '+j+');\'></td>';
  r +="</tr>";   
  table.append(r);
  maxRows++; 

  $("#tr-"+j).mousedown(function(e){  
    if( e.button == 2 ) { 
      type = $(this).attr("type");
      name = $(this).attr("name");
      index = $(this).attr("index");
      if(confirm("Sei sicuro di voler eliminare questo locator?\n"+type+" = "+name)){
        this.parentNode.removeChild(this); 
        var obj = {locId: index, locType: type, locName:name};    
        addon.port.emit("unmarkLocator", obj);
      }
      return false; 
    } 
  });       
})


// riconta le istanze di tutti gli elementi presenti nella tabella
function recountInst(){  
  table = $("#locTableBody");    
  var items = table.children();        
  items.each(function(i){ 
    tempType = $(this).attr("type");
    tempName = $(this).attr("name");
    tempIndex = $(this).attr("index");      
            
    var locObj =  {locName : tempName, locType : tempType, index : tempIndex};
    addon.port.emit("recountInstances", locObj);
  }); 
}


// funzione per il ricalcolo delle istanze senza che la tabella venga ricaricata
addon.port.on("instancesRecounted", function(payload){     
  j = payload.index;      
  locN = payload.locN;  
  $("#td-inst-"+j).html(locN);        
})  



// evidenzia gli elementi corrispondenti al locator passato come parametro
function markLocator(type, name, id){     
    colId = (id % 41)+1;  // cicla l'array dei colori nel caso nella tabella siano presenti più di 40 locators
    var payload = {locId: id, locType: type, locName:name, locColor: colors[colId]};    
    
    if($("#tr-"+id).hasClass("unmarked")){ 
        $("#tr-"+id).attr("class", "marked");
        $("#tr-"+id+" .colorbox").css("backgroundColor", colors[colId]);
        addon.port.emit("markLocator", payload); 
    }
    else{
        $("#tr-"+id).attr("class", "unmarked");
        $("#tr-"+id+" .colorbox").css("backgroundColor", colors[0]);
        addon.port.emit("unmarkLocator", payload);
    }
}


//gestione dei mark in caso di resize della finestra 
window.onresize=function(){  
  table = $("#locTableBody");    
  var items = table.children();
  addon.port.emit("unmarkAll");         
  items.each(function(i){
    if($(this).hasClass("marked")) {
      tempType = $(this).attr("type");
      tempName = $(this).attr("name"); 
      tempIndex = $(this).attr("index");        
      colId = (tempIndex % 41)+1;  
      var payload = {locId: tempIndex, locType: tempType, locName:tempName, locColor: colors[colId]};   
      addon.port.emit("markLocator", payload); 
    }
  });   
}


//aggiunge alla tabella un nuovo locator (dopo aver contato le istanze del corrispondente elemento)
function addLoc(){
  console.log("oO");
  tempName = $("#inputNewLoc").val();
  if(tempName!=''){
    tempType = $("#typeSel").val(); 
    //table = $("#locTableBody");
    
    //nameEscaped = tempName.replace(/'/g, "&#39;");  
        //var items = table.children();
    j = maxRows+1;
    var locObj =  {locName : tempName, locType : tempType, nIndex : j}; 
    addon.port.emit("countInstances", locObj); 
  }  
}

// disabilita il menu contestuale dal tasto destro del mouse
$(document).ready(function(){ 
  document.oncontextmenu = function() {return false;};  
});
