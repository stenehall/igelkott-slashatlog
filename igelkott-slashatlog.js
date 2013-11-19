var http = require("http");
var fs = require('fs');

var Slashatlog = function Slashatlog() {
  this.listeners = {'PRIVMSG': this.logger, 'trigger:startlog': this.startlog, 'trigger:stoplog': this.stoplog};

  this.name = 'slashatlog';
  this.help = {
    "default": "",
  };

  this.currentState = false;

  fs.mkdir('slashatlog',function(e){
    if(e)
    {
      console.log(e);
    }
  });
};

Slashatlog.prototype.startlog = function startlog(message) {
  this.currentState = true;
};

Slashatlog.prototype.stoplog = function stoplog(message) {
  this.currentState = false;
};


Slashatlog.prototype.logger = function logger(message) {

  if(this.currentState)
  {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;

    var yyyy = today.getFullYear();
    if(dd<10){
      dd='0'+dd;
    }
    if(mm<10){
      mm='0'+mm;
    }
    var date = yyyy+'-'+mm+'-'+dd;

    var time = today.getHours()+':'+today.getMinutes()+':'+today.getSeconds();

    var data = {
      'time' : date+" "+time,
      'user' : message.prefix.nick,
      'text' : message.parameters[1]
    };

    fs.appendFile("./slashatlog/"+date, JSON.stringify(data)+"\n", function(err) {
      if(err) {
        console.log(err);
      }
    });
  }
};


exports.Plugin = Slashatlog;
