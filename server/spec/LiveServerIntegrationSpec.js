var request = require('request');
var expect = require('chai').expect;

describe('server', function() {
  it('should respond to GET requests for /classes/messages with a 200 status code', function(done) {
    request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('should send back parsable stringified JSON', function(done) {
    request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
      expect(JSON.parse.bind(this, body)).to.not.throw();
      done();
    });
  });

  it('should send back an object', function(done) {
    request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
      var parsedBody = JSON.parse(body);
      expect(parsedBody).to.be.an('object');
      done();
    });
  });

  it('should send an object containing a `results` array', function(done) {
    request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
      var parsedBody = JSON.parse(body);
      expect(parsedBody).to.be.an('object');
      expect(parsedBody.results).to.be.an('array');
      done();
    });
  });

  it('should accept POST requests to /classes/messages', function(done) {
    var requestParams = {method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        username: 'Jono',
        message: 'Do my bidding!'}
    };

    request(requestParams, function(error, response, body) {
      expect(response.statusCode).to.equal(201);
      done();
    });
  });

  it('should respond with messages that were previously posted', function(done) {
    var requestParams = {method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        username: 'Jono',
        message: 'Do my bidding!'}
    };

    request(requestParams, function(error, response, body) {
      // Now if we request the log, that message we posted should be there:
      request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
        var messages = JSON.parse(body).results;
        expect(messages[0].username).to.equal('Jono');
        expect(messages[0].message).to.equal('Do my bidding!');
        done();
      });
    });
  });

  it('Should 404 when asked for a nonexistent endpoint', function(done) {
    request('http://127.0.0.1:3000/arglebargle', function(error, response, body) {
      expect(response.statusCode).to.equal(404);
      done();
    });
  });


  it('Should store data in the order it was entered', function(done) {
    // create 3 stub message objects
    var requests = [{method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        username: 'Justin',
        message: 'Spinach Juice!'}},
    {method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        username: 'Peter',
        message: 'Mad tight!'}},
    {method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        username: 'Oleg',
        message: 'Run tests!'}}];

    request(requests[0], function(error, response, body) {
      request(requests[1], function(error, response, body) {
        request(requests[2], function(error, response, body) {
          request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
            var messages = JSON.parse(body).results;
            expect(messages[messages.length - 3].username).to.equal('Justin');
            expect(messages[messages.length - 2].username).to.equal('Peter');
            expect(messages[messages.length - 1].username).to.equal('Oleg');
            done();
          });
        });
      });
    });

  });


});


























