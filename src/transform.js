var Stream = require( 'stream' )
var fs = require( 'fs' )
var TSVStream = require( './tsv-stream' )

var jsonData = require( './data.json' )

function camelCase( str ) {
  return str.toLowerCase()
    .replace( /\s+(\S)/g, function( m, g1 ) {
      return g1.toUpperCase()
    })
}

function separate( str ) {
  return str
    .replace( /[A-Z]/g, function( m ) {
      return ' ' + m.toLowerCase()
    })
}

function toJSON( file, callback ) {
  
  var table = []
  var done = callback || Function.prototype
  
  fs.createReadStream( file )
    .pipe( new TSVStream() )
    .on( 'data', function( row ) { table.push( row ) })
    .on( 'end', function() {
      
      var fields = table.shift()
        .map( camelCase )
      
      table = table.map( function( row ) {
        return row.reduce( function( out, value, i ) {
          out[ fields[i] ] = value
          return out
        }, {})
      })
      
      fs.writeFileSync(
        file.replace( /\.[^\.]+$/, '.json' ),
        JSON.stringify( table, null, 2 )
      )
      
      done()
      
    })
  
}

toJSON( './table-a1.tsv' )
toJSON( './table-a3.tsv' )
