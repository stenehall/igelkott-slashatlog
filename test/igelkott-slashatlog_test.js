var assert = require('chai').assert,
  fs = require('fs'),
  Stream = require('stream'),

  Igelkott = require('igelkott'),
  Slashatlog = require('../igelkott-slashatlog.js').Plugin;


describe('Slashatlog', function() {

  var igelkott,
    config,
    s,
    server;


  beforeEach(function() {
    s = new Stream.PassThrough({
      objectMode: true
    });

    config = {
      "server": {
        "nick": "igelkott",
      },
      core: ['privmsg'],
      plugins: {},
      'adapter': s,
      'connect': function() {
        this.server.emit('connect');
      }
    };

    igelkott = new Igelkott(config);
  });

  it('Should create testLog folder for log files', function(done) {

    igelkott.plugin.load('slashatlog', {
      logPath: './testLog'
    }, Slashatlog);


    igelkott.connect();

    fs.exists('./testLog', function(exists) {
      if (exists) {
        done();
      }
    });
  });


  it('Should start logging on trigger:startlog', function(done) {

    igelkott.plugin.load('slashatlog', {
      logPath: './testLog'
    }, Slashatlog);

    igelkott.on('slashatlog:start', function() {
      assert.equal(igelkott.plugin.plugins.slashatlog.currentState, true);
      done();
    });

    igelkott.connect();
    s.write(":dsmith!~dsmith@unaffiliated/dsmith PRIVMSG #foobar :!startlog\r\n");
  });

  it('Should stop logging on trigger:stoplog', function(done) {

    igelkott.plugin.load('slashatlog', {
      logPath: './testLog'
    }, Slashatlog);

    igelkott.on('slashatlog:start', function() {
      s.write(":dsmith!~dsmith@unaffiliated/dsmith PRIVMSG #foobar :!stoplog\r\n");
    });

    igelkott.on('slashatlog:stop', function() {
      assert.equal(igelkott.plugin.plugins.slashatlog.currentState, false);
      done();
    });

    igelkott.connect();
    s.write(":dsmith!~dsmith@unaffiliated/dsmith PRIVMSG #foobar :!startlog\r\n");
  });


  it('Should log to date file', function(done) {

    igelkott.plugin.load('slashatlog', {
      logPath: './testLog'
    }, Slashatlog);


    igelkott.on('slashatlog:write', function(data) {
      s.write(":dsmith!~dsmith@unaffiliated/dsmith PRIVMSG #foobar :Lorem ipsum\r\n");

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
      var date = yyyy + '-' + mm + '-' + dd;

      fs.readFile('./testLog/' + date, function(err, data) {
        if (err) throw err;
        var lines = data.toString().split("\n");
        lines.pop();
        var lastLine = JSON.parse(lines.pop());
        if (lastLine.text == 'Lorem ipsum') {
          done();
        }
      });

    });

    igelkott.connect();
    s.write(":dsmith!~dsmith@unaffiliated/dsmith PRIVMSG #foobar :!startlog\r\n");
  });

});
