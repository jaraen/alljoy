typeof JKL == "undefined" && (JKL = function() {});

JKL.Dumper = function() {
    return this;
};

JKL.Dumper.prototype.dump = function(data, offset) {
    typeof offset == "undefined" && (offset = "");
    var nextoff = offset + "  ";
    switch (typeof data) {
      case "string":
        return "\"" + this.escapeString(data) + "\"";
      case "number":
        return data;
      case "boolean":
        return data ? "true" : "false";
      case "undefined":
        return "null";
      case "object":
        if (data == null) return "null";
        if (data.constructor == Array) {
            var array = [];
            for (var i = 0; i < data.length; i++) array[i] = this.dump(data[i], nextoff);
            return "[\n" + nextoff + array.join(",\n" + nextoff) + "\n" + offset + "]";
        }
        var array = [];
        for (var key in data) {
            var val = this.dump(data[key], nextoff);
            key = "\"" + this.escapeString(key) + "\"";
            array[array.length] = key + ": " + val;
        }
        return array.length == 1 && !array[0].match(/[\n\{\[]/) ? "{ " + array[0] + " }" : "{\n" + nextoff + array.join(",\n" + nextoff) + "\n" + offset + "}";
      default:
        return data;
    }
};

JKL.Dumper.prototype.escapeString = function(str) {
    return str.replace(/\\/g, "\\\\").replace(/\"/g, "\\\"");
};

module.exports = JKL;