function Controller() {
    function copyXmlToClipboard() {
        Titanium.UI.Clipboard.clearText();
        Titanium.UI.Clipboard.setText($.xmlArea.value);
        alert("Value copied. Paste the content inside a Window or a view container in your XML alloy file." + Titanium.UI.Clipboard.getText());
    }
    function copyTssToClipboard() {
        Titanium.UI.Clipboard.setText($.tssArea.value);
        alert("Value copied. Paste the content inside your style TSS file.");
    }
    function closeWin(e) {
        $.mainWin.close();
    }
    function convertBalsamiqToXML() {
        cleanLog();
        if (!$.balsamiqXmlArea.value) {
            log("Export your balsamiq mockup to xml and paste in the Balsamiq XML field. Then click Go!");
            return;
        }
        var xotree = new XML.ObjTree, dumper = new JKL.Dumper, tree = xotree.parseXML($.balsamiqXmlArea.value), jsonString = dumper.dump(tree);
        log("Balsamiq json: " + jsonString);
        var doc = JSON.parse(jsonString);
        if (!doc.mockup) {
            log("Error: No mockup property on document");
            return;
        }
        var newJson = {}, newStyles = {}, controls = doc.mockup.controls.control || [];
        for (var i = 0, j = controls.length; i < j; i++) {
            var control = controls[i], newControl = {}, newStyle = {}, classControl = balsamiqControlCorrespondence(control["-controlTypeID"]), idName = hasCustomID(control) ? getCustomID(control) : createClassName(control), uniqueId = classControl.name + " id=\"" + idName + "\"";
            classControl.log && log(uniqueId + ": " + classControl.log);
            newJson[uniqueId] = newControl;
            for (var key in control) if (key === "controlProperties") for (var key2 in control[key]) ignoreProperty(key2) || (classControl.controlProperties && classControl.controlProperties[key2] ? newStyle[classControl.controlProperties[key2]] = unescape(control[key][key2]) : newStyle[balsamiqPropertyCorrespondence(key2, classControl.name)] = unescape(control[key][key2])); else key !== "-controlTypeID" && (ignoreProperty(key) || (newStyle[balsamiqPropertyCorrespondence(key)] = control[key]));
            if (classControl.defaultProperties) {
                var props = classControl.defaultProperties;
                for (var key in props) newStyle[key] = props[key];
            }
            newStyle["width"] == "-1" && (newStyle.width = Ti.UI.SIZE);
            newStyle["height"] == "-1" && (newStyle.height = Ti.UI.SIZE);
            newStyles["#" + createClassName(control)] = newStyle;
        }
        var tssValue = JSON.stringify(newStyles, null, "	");
        tssValue = tssValue.substr(0, tssValue.length - 1);
        tssValue = tssValue.substr(1);
        $.tssArea.value = tssValue;
        $.xmlArea.value = formatXml(xotree.writeXML(newJson));
        log("## Tip: force resize all components in balsamiq to ensure valid height/width values.\n");
        log("\nDone!");
    }
    function createClassName(obj) {
        var type = obj["-controlTypeID"].substr(obj["-controlTypeID"].lastIndexOf("::") + 2);
        return obj.controlProperties && obj.controlProperties.customID ? obj.controlProperties.customID : type + obj["-controlID"];
    }
    function hasCustomID(obj) {
        return obj.controlProperties && obj.controlProperties.customID ? !0 : !1;
    }
    function getCustomID(obj) {
        return obj.controlProperties.customID;
    }
    function log(msg) {
        $.logArea.value = msg + "\n" + $.logArea.value;
    }
    function cleanLog() {
        $.logArea.value = "";
    }
    function ignoreProperty(key) {
        var ignoreProperties = [ "-measuredW", "-measuredH", "-locked", "-isInGroup", "customID" ];
        return ignoreProperties.indexOf(key) > -1;
    }
    function balsamiqControlCorrespondence(controlName) {
        var dict = SUPPORTED_COMPONENTS;
        return dict[controlName] ? dict[controlName] : dict["default"];
    }
    function balsamiqPropertyCorrespondence(propName, controlClass) {
        var dict = {
            "-w": "width",
            "-h": "height",
            "-x": "left",
            "-y": "top",
            "-zOrder": "zIndex",
            controlProperties: "controlProperties",
            "-locked": "locked",
            "-isInGroup": "isInGroup",
            "-controlID": "controlID",
            "": ""
        };
        return dict[propName] ? dict[propName] : "prop_" + propName;
    }
    function convertJSON2XML() {
        var xotree = new XML.ObjTree, json = eval("(" + $.balsamiqXmlArea.value + ")");
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
    $.__views.__alloyId0 = Alloy.createController("closeButton", {
        id: "__alloyId0"
    });
    $.__views.__alloyId0.setParent($.__views.mainWin);
    $.__views.__alloyId0.on("click", closeWin);
    $.__views.__alloyId1 = A$(Ti.UI.createLabel({
        color: "#000",
        top: 10,
        textAlign: "center",
        font: {
            fontSize: 20,
            fontWeight: "bold",
            fontFamily: "Verdana"
        },
        text: "Balsamiq to Alloy views converter",
        id: "__alloyId1"
    }), "Label", $.__views.mainWin);
    $.__views.mainWin.add($.__views.__alloyId1);
    $.__views.__alloyId2 = A$(Ti.UI.createLabel({
        color: "#333",
        top: 30,
        textAlign: "center",
        font: {
            fontSize: 16,
            fontWeight: "bold",
            fontFamily: "Verdana"
        },
        text: "Export a Balsamiq selection and paste here to generate XML and style files.",
        id: "__alloyId2"
    }), "Label", $.__views.mainWin);
    $.__views.mainWin.add($.__views.__alloyId2);
    $.__views.balsamiqXmlArea = A$(Ti.UI.createTextArea({
        backgroundColor: "#fff",
        borderWidth: 2,
        borderRadius: 5,
        borderColor: "#999",
        paddingLeft: "5dp",
        paddingRight: "5dp",
        paddingTop: "5dp",
        paddingBottom: "5dp",
        font: {
            fontFamily: "Courier",
            fontSize: 14
        },
        controlID: "4",
        left: "32",
        top: "109",
        width: "492",
        height: "367",
        zIndex: "0",
        propcustomID: "balsamiqXmlArea",
        id: "balsamiqXmlArea"
    }), "TextArea", $.__views.mainWin);
    $.__views.mainWin.add($.__views.balsamiqXmlArea);
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
            fontFamily: "Courier",
            fontSize: 14
        },
        controlID: "5",
        left: "539",
        top: "109",
        width: "370",
        height: "164",
        zIndex: "1",
        propcustomID: "xmlArea",
        id: "xmlArea"
    }), "TextArea", $.__views.mainWin);
    $.__views.mainWin.add($.__views.xmlArea);
    $.__views.tssArea = A$(Ti.UI.createTextArea({
        backgroundColor: "#fff",
        borderWidth: 2,
        borderRadius: 5,
        borderColor: "#999",
        paddingLeft: "5dp",
        paddingRight: "5dp",
        paddingTop: "5dp",
        paddingBottom: "5dp",
        font: {
            fontFamily: "Courier",
            fontSize: 14
        },
        controlID: "6",
        left: "539",
        top: "304",
        width: "369",
        height: "172",
        zIndex: "2",
        propcustomID: "tssArea",
        id: "tssArea"
    }), "TextArea", $.__views.mainWin);
    $.__views.mainWin.add($.__views.tssArea);
    $.__views.view7 = A$(Ti.UI.createLabel({
        color: "#000",
        controlID: "7",
        left: "542",
        top: "86",
        width: "auto",
        height: "auto",
        zIndex: "3",
        text: "Alloy XML:",
        id: "view7"
    }), "Label", $.__views.mainWin);
    $.__views.mainWin.add($.__views.view7);
    $.__views.view8 = A$(Ti.UI.createLabel({
        color: "#000",
        controlID: "8",
        left: "542",
        top: "288",
        width: "85",
        height: "21",
        zIndex: "4",
        text: "Alloy TSS:",
        id: "view8"
    }), "Label", $.__views.mainWin);
    $.__views.mainWin.add($.__views.view8);
    $.__views.view9 = A$(Ti.UI.createLabel({
        color: "#000",
        controlID: "9",
        left: "38",
        top: "86",
        width: "auto",
        height: "auto",
        zIndex: "5",
        text: "Balsamiq XML:",
        id: "view9"
    }), "Label", $.__views.mainWin);
    $.__views.mainWin.add($.__views.view9);
    $.__views.btnGo = A$(Ti.UI.createButton({
        color: "#000",
        controlID: "12",
        left: "433",
        top: "75",
        width: "91",
        height: "30",
        zIndex: "8",
        propcustomID: "btnGo",
        title: "Go!",
        id: "btnGo"
    }), "Button", $.__views.mainWin);
    $.__views.mainWin.add($.__views.btnGo);
    $.__views.btnGo.on("click", convertBalsamiqToXML);
    $.__views.logArea = A$(Ti.UI.createTextArea({
        backgroundColor: "#fff",
        borderWidth: 2,
        borderRadius: 5,
        borderColor: "#999",
        paddingLeft: "5dp",
        paddingRight: "5dp",
        paddingTop: "5dp",
        paddingBottom: "5dp",
        font: {
            fontFamily: "Courier",
            fontSize: 14
        },
        controlID: "13",
        left: "32",
        top: "510",
        width: "877",
        height: "97",
        zIndex: "9",
        propcustomID: "logArea",
        id: "logArea"
    }), "TextArea", $.__views.mainWin);
    $.__views.mainWin.add($.__views.logArea);
    $.__views.view14 = A$(Ti.UI.createLabel({
        color: "#000",
        controlID: "14",
        left: "32",
        top: "489",
        width: "85",
        height: "21",
        zIndex: "10",
        text: "log:",
        id: "view14"
    }), "Label", $.__views.mainWin);
    $.__views.mainWin.add($.__views.view14);
    _.extend($, $.__views);
    var SUPPORTED_COMPONENTS = {
        "com.balsamiq.mockups::Button": {
            name: "Button",
            controlProperties: {
                text: "title"
            }
        },
        "com.balsamiq.mockups::Switch": {
            name: "Switch",
            defaultProperties: {
                value: !0
            }
        },
        "com.balsamiq.mockups::Map": {
            name: "View ns='Ti.Map'"
        },
        "com.balsamiq.mockups::VideoPlayer": {
            name: "VideoPlayer  ns='Ti.Media'",
            defaultProperties: {
                backgroundColor: "#000"
            },
            log: "VideoPlayer requires to set url property"
        },
        "com.balsamiq.mockups::Image": {
            name: "ImageView",
            log: "ImageView requires to set image property"
        },
        "com.balsamiq.mockups::List": {
            name: "TableView",
            containsItems: !0
        },
        "com.balsamiq.mockups::iPhoneMenu": {
            name: "TableView",
            containsItems: !0
        },
        "com.balsamiq.mockups::iPhonePicker": {
            name: "Picker",
            containsItems: !0
        },
        "com.balsamiq.mockups::Canvas": {
            name: "View",
            controlProperties: {
                color: "backgroundColor",
                borderColor: "borderColor"
            }
        },
        "com.balsamiq.mockups::SearchBox": {
            name: "SearchBar",
            controlProperties: {
                text: "value"
            }
        },
        "com.balsamiq.mockups::Label": {
            name: "Label",
            controlProperties: {
                text: "text"
            }
        },
        "com.balsamiq.mockups::SubTitle": {
            name: "Label",
            controlProperties: {
                text: "text"
            },
            defaultProperties: {
                font: {
                    fontSize: 18
                }
            }
        },
        "com.balsamiq.mockups::Title": {
            name: "Label",
            controlProperties: {
                text: "text"
            },
            defaultProperties: {
                font: {
                    fontSize: 24
                }
            }
        },
        "com.balsamiq.mockups::TextInput": {
            name: "TextField",
            controlProperties: {
                text: "value"
            }
        },
        "com.balsamiq.mockups::TextArea": {
            name: "TextArea",
            controlProperties: {
                text: "value"
            }
        },
        "com.balsamiq.mockups::HSlider": {
            name: "Slider",
            controlProperties: {
                value: "value"
            }
        },
        "com.balsamiq.mockups::ProgressBar": {
            name: "ProgressBar",
            log: "ProgressBar require to show() in controller"
        },
        "default": {
            name: "View backgroundColor=\"red\"",
            log: "Class component not supported"
        }
    }, XML = require("/ObjTree"), JKL = require("JKLDumper"), formatXml = function(xml) {
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