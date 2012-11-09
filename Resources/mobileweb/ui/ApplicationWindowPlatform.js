function ApplicationWindowPlatform(self, webView, titleBarOn, drawerOn) {
    titleBarOn && webView.addEventListener("load", function(e) {
        self.title = webView.evalJS("document.title");
    });
    if (drawerOn) {
        var Drawer = require("ui/Drawer"), drawer = new Drawer(self), backButton = Ti.UI.createButton({
            backgroundImage: "/images/LeftArrow.png",
            width: 48,
            height: 48
        });
        backButton.addEventListener("click", function(e) {
            webView.goBack();
        });
        drawer.buttonBar.add(backButton);
        var forwardButton = Ti.UI.createButton({
            backgroundImage: "/images/RightArrow.png",
            width: 48,
            height: 48
        });
        forwardButton.addEventListener("click", function(e) {
            webView.goForward();
        });
        drawer.buttonBar.add(forwardButton);
        self.add(drawer.view);
    }
}

module.exports = ApplicationWindowPlatform;