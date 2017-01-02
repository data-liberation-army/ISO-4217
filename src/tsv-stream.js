var Stream = require( 'stream' )
var inherit = require( 'bloodline' )

/**
 * TSVStream constructor
 * @return {TSVStrea}
 */
function TSVStream() {
  
  if( !(this instanceof TSVStream) )
    return new TSVStream()
  
  Stream.Transform.call( this, {
    objectMode: true
  })
  
  this._buffer = ''
  
}

/**
 * TSVStream prototype
 * @type {Object}
 */
TSVStream.prototype = {
  
  constructor: TSVStream,
  
  _transform: function( data, _, next ) {
    
    if( data == null )
      return next( null, data )
    
    var lines = ( this._buffer + data )
      .split( /\r?\n/g )
    
    this._buffer = lines.pop()
    
    for( var i = 0; i < lines.length; i++ ) {
      this.push( lines[ i ].split( /\x09/g ) )
    }
    
    next()
    
  },
  
  _flush: function( done ) {
    this._transform( '\n', null, done )
  },
  
}

inherit( TSVStream, Stream.Transform )
// Exports
module.exports = TSVStream
