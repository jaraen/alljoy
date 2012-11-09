// Application Window Component Constructor, platform specific features
function ApplicationWindowPlatform(/*TiUIWindow*/self, /*TiUIView*/webView, /*boolean*/titleBarOn, /*boolean*/drawerOn) {

     if (titleBarOn) {
        // When the webview loads, set the title
        webView.addEventListener('load', function(e) {
            self.title = webView.evalJS('document.title');
        });

    }

    if (drawerOn) {
        // Put a back/forward button into a drawer at the bottom of the screen that can be
        // opened when needed. 
        var Drawer = require('ui/Drawer');
        var drawer = new Drawer(self);
        var backButton = Ti.UI.createButton({ 
            backgroundImage: '/images/LeftArrow.png' ,
            width: 48,
            height: 48
        });
        backButton.addEventListener('click', function (e) {
            webView.goBack();
        });
        drawer.buttonBar.add(backButton);
        var forwardButton = Ti.UI.createButton({ 
            backgroundImage: '/images/RightArrow.png' ,
            width: 48,
            height: 48
        });
        forwardButton.addEventListener('click', function (e) {
            webView.goForward();
        });
        drawer.buttonBar.add(forwardButton);       
        
        self.add(drawer.view);
    }
}

module.exports = ApplicationWindowPlatform;
