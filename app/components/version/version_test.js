'use strict';

describe('pemdasApp.version module', function() {
  beforeEach(module('pemdasApp.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
