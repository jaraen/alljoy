
// ================================================================
//  jkl-dumper.js ---- JavaScript Object Dumper
//  Copyright 2005-2006 Kawasaki Yusuke <u-suke@kawa.net>
//  2005/05/18 - First Release
//  2006/09/04 - http://www.rfc-editor.org/rfc/rfc4627.txt
//  ===============================================================

/******************************************************************

    <script type="text/javascript" src="./jkl-dumper.js" charset="Shift_JIS"></script>
    <script><!--
        var data = {
            string: "string",
            array:  [ 1, 2, 3 ],
            hash:   { key1: "value1", key2: "value2" },
            data1:  null,
            data2:  true,
            data3:  false
        };
        var dumper = new JKL.Dumper();
        document.write( dumper.dump( data ) );
    //--></script>

******************************************************************/

if ( typeof(JKL) == 'undefined' ) JKL = function() {};

//  JKL.Dumper Constructor

JKL.Dumper = function () {
    return this;
};

//  Dump the data into JSON format

JKL.Dumper.prototype.dump = function ( data, offset ) {
    if ( typeof(offset) == "undefined" ) offset = "";
    var nextoff = offset + "  ";
    switch ( typeof(data) ) {
    case "string":
        return '"'+this.escapeString(data)+'"';
        break;
    case "number":
        return data;
        break;
    case "boolean":
        return data ? "true" : "false";
        break;
    case "undefined":
        return "null";
        break;
    case "object":
        if ( data == null ) {
            return "null";
        } else if ( data.constructor == Array ) {
            var array = [];
            for ( var i=0; i<data.length; i++ ) {
                array[i] = this.dump( data[i], nextoff );
            }
            return "[\n"+nextoff+array.join( ",\n"+nextoff )+"\n"+offset+"]";
        } else {
            var array = [];
            for ( var key in data ) {
                var val = this.dump( data[key], nextoff );
//              if ( key.match( /[^A-Za-z0-9_]/ )) {
                    key = '"'+this.escapeString( key )+'"';
//              }
                array[array.length] = key+": "+val;
            }
            if ( array.length == 1 && ! array[0].match( /[\n\{\[]/ ) ) {
                return "{ "+array[0]+" }";
            }
            return "{\n"+nextoff+array.join( ",\n"+nextoff )+"\n"+offset+"}";
        }
        break;
    default:
        return data;
        // unsupported data type
        break;
    }
};

//  escape '\' and '"'

JKL.Dumper.prototype.escapeString = function ( str ) {
    return str.replace( /\\/g, "\\\\" ).replace( /\"/g, "\\\"" );
};

//  ===============================================================

module.exports = JKL;