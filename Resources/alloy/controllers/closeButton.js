function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    var $ = this, exports = {};
    $.__views.closeButton = A$(Ti.UI.createButton({
        color: "#000",
        width: 50,
        height: 50,
        left: 10,
        top: 10,
        title: "X",
        font: {
            fontSize: 20,
            fontWeight: "bold"
        },
        id: "closeButton"
    }), "Button", null);
    $.addTopLevelView($.__views.closeButton);
    _.extend($, $.__views);
    $.closeButton.on("click", function(e) {
        $.trigger("click", e);
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, A$ = Alloy.A;

module.exports = Controller;