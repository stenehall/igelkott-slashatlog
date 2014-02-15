var http = require("http");
var fs = require('fs');

var Slashatlog = function Slashatlog() {
  this.listeners = {
    'PRIVMSG': this.logger,
    'trigger:startlog': this.startlog,
    'trigger:stoplog': this.stoplog
  };

  this.name = 'slashatlog';
  this.help = {
    "default": "",
  };

  this.currentState = false;
  this.logPath = this.config.logPath || './slashatlog';

  var exists = fs.existsSync(this.logPath);

  if (!exists) {
    fs.mkdir(this.logPath, function(e) {
      if (e) {
        console.log(e);
      }
    });
  }
};

Slashatlog.prototype.startlog = function startlog(message) {
  this.currentState = true;
  this.igelkott.emit('slashatlog:start');

  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;

  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  this.date = yyyy + '-' + mm + '-' + dd;

  var obj = {
    command: 'PRIVMSG',
    parameters: [message.parameters[0], message.prefix.nick + ": Och så loggar vi lite."]
  };

  this.igelkott.push(obj);
};

Slashatlog.prototype.stoplog = function stoplog(message) {
  this.currentState = false;
  this.igelkott.emit('slashatlog:stop');

  var obj = {
    command: 'PRIVMSG',
    parameters: [message.parameters[0], message.prefix.nick + ": Okej då, vi glömmer väl det."]
  };

  this.igelkott.push(obj);
};


Slashatlog.prototype.logger = function logger(message) {

  if (this.currentState) {

    var today = new Date();
    var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();

    var data = {
      'time': this.date + " " + time,
      'user': message.prefix.nick,
      'text': message.parameters[1]
    };

    fs.appendFile("./" + this.logPath + "/" + this.date, JSON.stringify(data) + "\n", function(err) {
      if (err) {
        this.igelkott.emit('slashatlog:error');
        console.log(err);
      } else {
        this.igelkott.emit('slashatlog:write', data);
      }
    }.bind(this));
  }
};


exports.Plugin = Slashatlog;
