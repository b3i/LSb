var self = require("sdk/self");	// per identificare il percorso per caricare script e risorse
var tabs = require("sdk/tabs"); // per interagire con le pagine aperte in una tab
var sidebar = require("sdk/ui/sidebar").Sidebar({
  id: 'sidebar', 
  title: 'LSb - Locators Sidebar',
  url: self.data.url("sidebar.html"),  
  
  onAttach: function(worker) {    
    worker.port.on("markLocator", function(el){ 
      var worker2 = tabs.activeTab.attach({
        contentScriptFile: self.data.url("markScript.js")        
      });
      worker2.port.emit("execMark", el);          
    })
    worker.port.on("unmarkLocator", function(el){      
      var worker2 = tabs.activeTab.attach({
        contentScriptFile: self.data.url("unmarkScript.js")
      });
      worker2.port.emit("execUnmark", el);          
    })
    worker.port.on("unmarkAll", function(){  
      var worker2 = tabs.activeTab.attach({
        contentScriptFile: self.data.url("unmarkAllScript.js")
      }); 
      worker2.port.emit("execUnmarkAll");      
    })
    worker.port.on("countInstances", function(locObj){      
      var worker3 = tabs.activeTab.attach({
        contentScriptFile: self.data.url("countScript.js")
      });
      worker3.port.emit("execCount", locObj);  
      worker3.port.on("instancesCounted", function(payload){        
        worker.port.emit("instancesCounted", payload);        
      })              
    })
    worker.port.on("recountInstances", function(locObj){     
      worker3 = tabs.activeTab.attach({
        contentScriptFile: self.data.url("recountScript.js")
      });
      worker3.port.emit("execRecount", locObj);   
      worker3.port.on("instancesRecounted", function(payload){       
        worker.port.emit("instancesRecounted", payload);        
      })              
    })      
  }
  
  /* codice per controllare che la sidebar si apra e si chiuda correttamente
  onAttach: function (worker) {
    P("attaching");
  },
  onShow: function () {
    console.log("showing");
  },
  onHide: function () {
    console.log("hiding");
  },
  onDetach: function () {
    console.log("detaching");
  }*/
});


  var buttons = require('sdk/ui/button/action');
  var button = buttons.ActionButton({
    id: "btn-sidebar",
    label: "Open locators sidebar",
    icon: {
      "16": "./icon16.png",
      "32": "./icon32.png",
      "64": "./icon64.png"
    },
    onClick: handleSidebar,  
  });

  function handleSidebar(state){	
    sidebar.show();  
  }

/* LETTURA DA FILE */
const {Cu} = require("chrome");
const {TextDecoder, OS} = Cu.import("resource://gre/modules/osfile.jsm", {});
const {Task} = Cu.import("resource://gre/modules/Task.jsm", {});
// It is important to load TextEncoder like this using Cu.import()
// You cannot load it by just |Cu.import("resource://gre/modules/osfile.jsm");|


/* ESEMPIO FUNZIONANTE DI SCRITTURA SU FILE
const {Cu} = require("chrome");
const {TextEncoder, OS} = Cu.import("resource://gre/modules/osfile.jsm", {});
const {Task} = Cu.import("resource://gre/modules/Task.jsm", {});
// It is important to load TextEncoder like this using Cu.import()
// You cannot load it by just |Cu.import("resource://gre/modules/osfile.jsm");|

function write_text(filename, text) {
    var encoder = new TextEncoder();
    var data = encoder.encode(text);
    filename = OS.Path.join(OS.Constants.Path.desktopDir, filename);
    //filename = OS.Path.join(OS.Constants.Path.tmpDir, filename);
    Task.spawn(function() {
       let file = yield OS.File.open(filename, {write: true});
       yield file.write(data);
       yield file.close(); 
       console.log("written to", filename);
    }).then(null, function(e) console.error(e));
}

write_text("foo.txt", "some text");
*/

/* TEST PER MENU CONTESTUALE PER ELIMINARE I MARKS
var cm = require("sdk/context-menu");
cm.Item({
  
  context: cm.SelectorContext("div[class='locMark']"),  
  label: "Unmark this item",
  contentScript: 'self.on("context", function(node){ return("LSB: unmark ("+node.getAttribute("type")+"="+node.getAttribute("locName")+")");});'+
                 'self.on("click", function(node){ '+
                 '  var worker2 = tabs.activeTab.attach({ '+
                 '  contentScriptFile: self.data.url("unmarkScript.js") '+
                 '  }); '+
                 '  var el = {locId: index, locType: node.getAttribute("type"), locName:node.getAttribute("locName")}; '+
                 '  worker2.port.emit("execUnmark", el); '+
                 '});',
});*/
