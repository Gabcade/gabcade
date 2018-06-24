(function ( ) {
'use strict';

var opus = window.opus = window.opus || { };

class Gabcade {

  constructor ( ) { }

  closeGdprAlert ( ) {
    var resource = new opus.OpusResource();
    resource.post('/alerts/gdpr');
  }
}

opus.gabcade = new Gabcade();

})();
