var assert = require('chai').assert,
Stream = require('stream'),
nock = require('nock'),

Igelkott = require('igelkott'),
Talk = require('../igelkott-talk.js').Plugin;


describe('Talk', function() {

  var igelkott,
  config,
  s,
  server;

  beforeEach(function () {
    s = new Stream.PassThrough({objectMode: true});

    config = {
      "server": {
        "nick": "igelkott",
      },
      plugins:['privmsg'],
      'adapter': s, 'connect': function() { this.server.emit('connect'); }
    };

    igelkott = new Igelkott(config);
  });


  it('Should respond to people saying hello', function(done) {
    igelkott.plugin.load('talk', Talk);

    s.on('data', function(data) {
      if(data == "PRIVMSG ##botbotbot :dsmith: hello\r\n")
      {
        done();
      }
    });

    igelkott.connect();
    s.write(":dsmith!~dsmith@unaffiliated/dsmith PRIVMSG ##botbotbot :hi igelkott\r\n");
  });

});
