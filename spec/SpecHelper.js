beforeEach(function() {

  window.alert = function() {}; // Block alerts

  this.addMatchers({
    toBeCreated: function(expectedSong) {
      var process = this.actual;
      return process.id > 0
    }
  })
});
