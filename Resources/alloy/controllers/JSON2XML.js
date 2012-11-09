function Controller() {
    function closeWin(e) {
        $.mainWin.close();
    }
    function convertXML2JSON() {
        var xotree = new XML.ObjTree, dumper = new JKL.Dumper, tree = xotree.parseXML($.xmlArea.value);
        $.jsonArea.value = dumper.dump(tree);
    }
    function convertJSON2XML() {
        var xotree = new XML.ObjTree, json = eval("(" + $.jsonArea.value + ")");
        $.xmlArea.value = formatXml(xotree.writeXML(json));
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    var $ = this, exports = {};
    $.__views.mainWin = A$(Ti.UI.createWindow({
        backgroundColor: "white",
        backgroundGradient: {
            colors: [ "#bbf", "#fff" ]
        },
        id: "mainWin"
    }), "Window", null);
    $.addTopLevelView($.__views.mainWin);
    $.__views.__alloyId7 = Alloy.createController("closeButton", {
        id: "__alloyId7"
    });
    $.__views.__alloyId7.setParent($.__views.mainWin);
    $.__views.__alloyId7.on("click", closeWin);
    $.__views.__alloyId8 = A$(Ti.UI.createView({
        height: Ti.UI.SIZE,
        layout: "vertical",
        id: "__alloyId8"
    }), "View", $.__views.mainWin);
    $.__views.mainWin.add($.__views.__alloyId8);
    $.__views.__alloyId9 = A$(Ti.UI.createButton({
        color: "#000",
        title: "to XML",
        id: "__alloyId9"
    }), "Button", $.__views.__alloyId8);
    $.__views.__alloyId8.add($.__views.__alloyId9);
    $.__views.__alloyId9.on("click", convertJSON2XML);
    $.__views.__alloyId10 = A$(Ti.UI.createButton({
        color: "#000",
        title: "to JSON",
        id: "__alloyId10"
    }), "Button", $.__views.__alloyId8);
    $.__views.__alloyId8.add($.__views.__alloyId10);
    $.__views.__alloyId10.on("click", convertXML2JSON);
    $.__views.__alloyId11 = A$(Ti.UI.createLabel({
        color: "#000",
        top: 10,
        textAlign: "center",
        font: {
            fontSize: 20,
            fontWeight: "bold",
            fontFamily: "Verdana"
        },
        text: "JSON to XML Alloy views converter",
        id: "__alloyId11"
    }), "Label", $.__views.mainWin);
    $.__views.mainWin.add($.__views.__alloyId11);
    $.__views.__alloyId12 = A$(Ti.UI.createLabel({
        color: "#333",
        top: 30,
        textAlign: "center",
        font: {
            fontSize: 16,
            fontWeight: "bold",
            fontFamily: "Verdana"
        },
        text: "Write your views in JSON and convert to XML and viceversa",
        id: "__alloyId12"
    }), "Label", $.__views.mainWin);
    $.__views.mainWin.add($.__views.__alloyId12);
    $.__views.jsonArea = A$(Ti.UI.createTextArea({
        backgroundColor: "#fff",
        borderWidth: 2,
        borderRadius: 5,
        borderColor: "#999",
        paddingLeft: "5dp",
        paddingRight: "5dp",
        paddingTop: "5dp",
        paddingBottom: "5dp",
        font: {
            fontSize: 14,
            fontFamily: "Courier"
        },
        top: 100,
        left: 20,
        height: "600",
        width: "45%",
        enableReturnKey: !0,
        suppressReturn: !1,
        color: "#333",
        id: "jsonArea"
    }), "TextArea", $.__views.mainWin);
    $.__views.mainWin.add($.__views.jsonArea);
    $.__views.xmlArea = A$(Ti.UI.createTextArea({
        backgroundColor: "#fff",
        borderWidth: 2,
        borderRadius: 5,
        borderColor: "#999",
        paddingLeft: "5dp",
        paddingRight: "5dp",
        paddingTop: "5dp",
        paddingBottom: "5dp",
        font: {
            fontSize: 14,
            fontFamily: "Courier"
        },
        top: 100,
        right: 20,
        height: "600",
        width: "45%",
        enableReturnKey: !0,
        suppressReturn: !1,
        color: "#333",
        value: "Paste here a XML view from alloy to test how it works.",
        id: "xmlArea"
    }), "TextArea", $.__views.mainWin);
    $.__views.mainWin.add($.__views.xmlArea);
    $.__views.__alloyId13 = A$(Ti.UI.createLabel({
        color: "#bbb",
        top: 80,
        font: {
            fontSize: 20,
            fontWeight: "bold",
            fontFamily: "Verdana"
        },
        text: "JSON",
        left: "40",
        id: "__alloyId13"
    }), "Label", $.__views.mainWin);
    $.__views.mainWin.add($.__views.__alloyId13);
    $.__views.__alloyId14 = A$(Ti.UI.createLabel({
        color: "#bbb",
        top: 80,
        font: {
            fontSize: 20,
            fontWeight: "bold",
            fontFamily: "Verdana"
        },
        text: "XML",
        right: "40",
        id: "__alloyId14"
    }), "Label", $.__views.mainWin);
    $.__views.mainWin.add($.__views.__alloyId14);
    _.extend($, $.__views);
    var XML = require("/ObjTree"), JKL = require("JKLDumper"), formatXml = function(xml) {
        var reg = /(>)(<)(\/*)/g, wsexp = / *(.*) +\n/g, contexp = /(<.+>)(.+\n)/g;
        xml = xml.replace(reg, "$1\n$2$3").replace(wsexp, "$1\n").replace(contexp, "$1\n$2");
        var pad = 0, formatted = "", lines = xml.split("\n"), indent = 0, lastType = "other", transitions = {
            "single->single": 0,
            "single->closing": -1,
            "single->opening": 0,
            "single->other": 0,
            "closing->single": 0,
            "closing->closing": -1,
            "closing->opening": 0,
            "closing->other": 0,
            "opening->single": 1,
            "opening->closing": 0,
            "opening->opening": 1,
            "opening->other": 1,
            "other->single": 0,
            "other->closing": -1,
            "other->opening": 0,
            "other->other": 0
        };
        for (var i = 0; i < lines.length; i++) {
            var ln = lines[i], single = Boolean(ln.match(/<.+\/>/)), closing = Boolean(ln.match(/<\/.+>/)), opening = Boolean(ln.match(/<[^!].*>/)), type = single ? "single" : closing ? "closing" : opening ? "opening" : "other", fromTo = lastType + "->" + type;
            lastType = type;
            var padding = "";
            indent += transitions[fromTo];
            for (var j = 0; j < indent; j++) padding += "	";
            fromTo == "opening->closing" ? formatted = formatted.substr(0, formatted.length - 1) + ln + "\n" : formatted += padding + ln + "\n";
        }
        return formatted;
    };
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, A$ = Alloy.A;

module.exports = Controller;