function Controller() {
    function openJSON2XMLconverter(e) {
        var w = Alloy.createController("JSON2XML");
        w.mainWin.open();
    }
    function openStyleCodeCreator(e) {}
    function balsamiqToXmlConverter(e) {
        var w = Alloy.createController("Balsamiq2Alloy");
        w.mainWin.open();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    var $ = this, exports = {};
    $.__views.index = A$(Ti.UI.createWindow({
        backgroundColor: "white",
        id: "index"
    }), "Window", null);
    $.addTopLevelView($.__views.index);
    $.__views.__alloyId4 = A$(Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        backgroundColor: "#ddf",
        borderColor: "#aaf",
        borderWidth: 1,
        id: "__alloyId4"
    }), "View", $.__views.index);
    $.__views.index.add($.__views.__alloyId4);
    $.__views.label = A$(Ti.UI.createLabel({
        color: "#000",
        top: 10,
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        text: "Wellcome to Alljoy, a set of experimental tools to do Alloy more enjoyable.",
        id: "label"
    }), "Label", $.__views.__alloyId4);
    $.__views.__alloyId4.add($.__views.label);
    $.__views.__alloyId5 = A$(Ti.UI.createButton({
        color: "#000",
        top: 10,
        bottom: 5,
        title: "Convert JSON code to XML views",
        id: "__alloyId5"
    }), "Button", $.__views.__alloyId4);
    $.__views.__alloyId4.add($.__views.__alloyId5);
    $.__views.__alloyId5.on("click", openJSON2XMLconverter);
    $.__views.__alloyId6 = A$(Ti.UI.createButton({
        color: "#000",
        top: 10,
        bottom: 5,
        title: "Convert a XML Balsamiq document to Alloy",
        id: "__alloyId6"
    }), "Button", $.__views.__alloyId4);
    $.__views.__alloyId4.add($.__views.__alloyId6);
    $.__views.__alloyId6.on("click", balsamiqToXmlConverter);
    _.extend($, $.__views);
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, A$ = Alloy.A;

module.exports = Controller;