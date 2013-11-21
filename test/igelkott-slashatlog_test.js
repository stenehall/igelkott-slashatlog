var assert = require('chai').assert,
Stream = require('stream'),

Igelkott = require('igelkott'),
Slashatlog = require('../igelkott-slashatlog.js').Plugin;


describe('Slashatlog', function() {

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


  it('Should start logging on trigger:startlog');
  it('Should stop logging on trigger:stoplog');
  it('Should log to date file');

});