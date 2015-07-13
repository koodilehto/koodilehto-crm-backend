'use strict';
var assert = require('assert');
var connect = require('./rest_template').connect;

var utils = require('./suites/utils');
var getParameters = utils.getParameters;
var patchParameters = utils.patchParameters;
var generateDependencies = utils.generateDependencies;

var createClientAndUser = require('./test_invoice_db').createClientAndUser;

describe('Invoice REST API', function() {
  var urlRoot = 'http://localhost';
  var port = 3456;
  var resourceName = 'invoice';

  connect(urlRoot, port, resourceName);

  it('should fail with an empty invoice POST', function(done) {
    this.resource.post().then(function() {
      assert(false, 'Posted ' + resourceName + ' even though shouldn\'t');
    }).catch(function(res) {
      var data = res.data;

      assert(true, 'Failed to post ' + resourceName + ' as expected');

      assert.equal(res.status, 422);
      assert(data.message, 'Error message exists');
      assert(data.errors, 'Errors exist');
      assert(data.warnings, 'Warnings exist');
    }).finally(done);
  });

  it('should be able to POST an invoice', function(done) {
    createInvoice(this.client, this.schema, this.resource, function(err) {
      if(err) {
        return done(err);
      }

      assert(true, 'Posted ' + resourceName + ' as expected');

      done();
    });
  });

  it('should be able to GET an invoice', function(done) {
    this.resource.get().then(function(res) {
      assert(res.data.length === 0, 'Failed to get ' + resourceName + 's as expected');

      done();
    }).catch(done);
  });

  it('should be able to PUT an invoice', function(done) {
    this.resource.put().then(function() {
      assert(false, 'Updated ' + resourceName + ' even though shouldn\'t');
    }).catch(function() {
      assert(true, 'Failed to update ' + resourceName + ' as expected');
    }).finally(done);
  });

  it('should be able to approve an invoice', function(done) {
    // TODO
    done();
  });

  it('should be able to mark an invoice as paid', function(done) {
    // TODO
    done();
  });
});

function createInvoice(apiClient, schema, resource, cb) {
  var postSchema = resource.post.parameters[0].schema;

  createClientAndUser(function(client, user) {
    generateDependencies(apiClient, schema, postSchema).then(function(d) {
      d.push({
        field: 'receiver',
        value: client.id
      });
      d.push({
        field: 'sender',
        value: user.id
      });
      d.push({
        field: 'due',
        value: new Date()
      });

      resource.post(
        patchParameters(getParameters(postSchema), d)
      ).then(function(invoice) {
        cb(null, invoice);
      }).catch(cb);
    }).catch(cb);
  });
}
