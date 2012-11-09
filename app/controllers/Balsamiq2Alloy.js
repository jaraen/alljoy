
// Supported Components. The key is the balsamiq name for their components.
//
// - name: the name of the titanium component, as used in Alloy XML. If the view requires a namespace, should be indicated here also
//   for example, the name for maps is "View ns='Ti.Map'"
//
// Optional fields:
//
// - defaultProperties: properties that will be added to the tss even if is not defined
//
// - controlProperties: properties names from balsamiq that should be renamed in titanium (i.e. a textfield value property is called "value" and not "text")
//
// - log: any comment to log if the component is used, usually some warning
//
// - containItems: used for controls that may have a list of items, such as the picker or the tableView. Still not in use.

var SUPPORTED_COMPONENTS = {
	"com.balsamiq.mockups::Button":{
		name:"Button",
		controlProperties:{
			text:"title"
		}
	},
	"com.balsamiq.mockups::Switch":{
		name: "Switch",
		defaultProperties:{
			value:true
		},
	},
	"com.balsamiq.mockups::Map":{
		name: "View ns='Ti.Map'"
	},
	
	"com.balsamiq.mockups::VideoPlayer":{
		name:"VideoPlayer  ns='Ti.Media'",
		defaultProperties:{
			backgroundColor:'#000'
		},
		log: "VideoPlayer requires to set url property"
	},
	
	"com.balsamiq.mockups::Image":{
		name: "ImageView",
		log: "ImageView requires to set image property"
	},
	
	"com.balsamiq.mockups::List":{
		name: "TableView",
		containsItems:true,
		// controlProperties:["text"]
	},
	
	"com.balsamiq.mockups::iPhoneMenu":{
		name: "TableView",
		containsItems:true
	},
	
	"com.balsamiq.mockups::iPhonePicker":{
		name: "Picker",
		containsItems:true
	},
	
	"com.balsamiq.mockups::Canvas":{
		name: "View",
		controlProperties:{
			color: "backgroundColor",		//correspondence between the control property name and the titanium name
			borderColor:"borderColor"
		}
		
	},
	
	"com.balsamiq.mockups::SearchBox":{
		name:"SearchBar",
		controlProperties: { text: "value" }
	},
	
	"com.balsamiq.mockups::Label":{
		name: "Label",
		controlProperties: { text: "text" }
	},
	
	"com.balsamiq.mockups::SubTitle":{
		name: "Label",
		controlProperties: { text: "text" },
		defaultProperties:{
			font:{fontSize:18}
		}
	},
	
	"com.balsamiq.mockups::Title":{
		name: "Label",
		controlProperties: { text: "text" },
		defaultProperties:{
			font:{fontSize:24}
		}
	},
	
	"com.balsamiq.mockups::TextInput":{
		name: "TextField",
		controlProperties: { text: "value" }
	},
	
	"com.balsamiq.mockups::TextArea":{
		name: "TextArea",
		controlProperties: { text: "value" }
	},
	
	"com.balsamiq.mockups::HSlider":{
		name: "Slider",
		controlProperties: { value: "value" }
	},
	
	"com.balsamiq.mockups::ProgressBar":{
		name: "ProgressBar",
		log: "ProgressBar require to show() in controller"
	},
	
	"default":{
		name: "View backgroundColor=\"red\"",
		log: "Class component not supported"
	},
};



var XML = require('/ObjTree'),
	JKL = require('JKLDumper');

//called by buttons

function copyXmlToClipboard(){		//mmmh, copy to clipboard does not work outside the browser...
	Titanium.UI.Clipboard.clearText();
	Titanium.UI.Clipboard.setText($.xmlArea.value);
	alert('Value copied. Paste the content inside a Window or a view container in your XML alloy file.' + Titanium.UI.Clipboard.getText());
}

function copyTssToClipboard(){
	Titanium.UI.Clipboard.setText($.tssArea.value);
	alert('Value copied. Paste the content inside your style TSS file.');
}

function closeWin(e){
	$.mainWin.close();
}


//balsamiq to alloy functions
function convertBalsamiqToXML(){
	
	cleanLog();

	if(!$.balsamiqXmlArea.value){
		log('Export your balsamiq mockup to xml and paste in the Balsamiq XML field. Then click Go!');
		return;
	}
	
	var xotree = new XML.ObjTree();
    var dumper = new JKL.Dumper(); 
	var tree = xotree.parseXML($.balsamiqXmlArea.value);
	
	//convert xml tree to a more handy json format
	var jsonString = dumper.dump(tree);
	
	log("Balsamiq json: " + jsonString); //for debug purposes
	 
	 var doc = JSON.parse(jsonString);

	 if(!doc.mockup){
	 	log('Error: No mockup property on document');
	 	return;
	 }
	 
	 var newJson = {};
	 var newStyles = {}; 
	 
 	//todo: support grouped controls
 	var controls = doc.mockup.controls.control || [];	//this will fail if controls are grouped
 	
 	for(var i = 0, j = controls.length; i < j; i++){
 		
 		var control = controls[i],
 			newControl = {},
 			newStyle = {};
 			
		var classControl = balsamiqControlCorrespondence(control['-controlTypeID']);
 		
		var idName = hasCustomID(control) ? getCustomID(control) : createClassName(control);
					
		var uniqueId = classControl.name + " id=\"" + idName + "\"";
 		
 		if(classControl.log) log(uniqueId + ': ' + classControl.log);
 		
		newJson[uniqueId] = newControl;		//create unique array entries to avoid overwrite controls of the same type
		
 		for(var key in control){
 			
 			if(key === 'controlProperties'){
 				
 				for(var key2 in control[key]){
 					if(!ignoreProperty(key2)){
	 					if(classControl.controlProperties && classControl.controlProperties[key2]){		//is there a predefined correspondence with titanium?
			 				newStyle[classControl.controlProperties[key2]] = unescape(control[key][key2]);
			 			}else{
			 				newStyle[balsamiqPropertyCorrespondence(key2, classControl.name )] = unescape(control[key][key2]);
			 			}
		 			}
	 			}
	 			
 			}else if(key !== '-controlTypeID'){
 				
 				if(!ignoreProperty(key)){
	 				newStyle[balsamiqPropertyCorrespondence(key)] = control[key];
	 			}
 			}
 		}
 		
 		//default properties
		if(classControl.defaultProperties){
			var props = classControl.defaultProperties;
			for(var key in props){
				newStyle[key] = props[key];
			}
		}

 		//ensure valid size properties
 		if(newStyle["width"] == "-1") newStyle["width"] = Ti.UI.SIZE;
 		if(newStyle["height"] == "-1") newStyle["height"] = Ti.UI.SIZE;
 		
		newStyles['#' + createClassName(control)] = newStyle;
 		
 	}
 	
 	
 	//output results
 	var tssValue = JSON.stringify(newStyles, null, "\t");
 	tssValue = tssValue.substr(0, tssValue.length-1);	//non efficient way to remove first...
 	tssValue = tssValue.substr(1);						//and last character, that's the { and } symbols
 	$.tssArea.value = tssValue;
 	
 	//remove first and last lines, which contains { } json symbols
 	$.xmlArea.value = formatXml(xotree.writeXML(newJson)); 
 	
 	log('## Tip: force resize all components in balsamiq to ensure valid height/width values.\n');
	log('\nDone!');
	 
}

function createClassName(obj){
	var type = obj['-controlTypeID'].substr(obj['-controlTypeID'].lastIndexOf('::') + 2);
	return obj.controlProperties && obj.controlProperties.customID ? obj.controlProperties.customID: type + obj['-controlID'];
}
function hasCustomID(obj){
	return obj.controlProperties && obj.controlProperties.customID ? true: false;
}
function getCustomID(obj){
	return obj.controlProperties.customID;
}

function log(msg){
	$.logArea.value = msg + '\n' + $.logArea.value;
}
function cleanLog(){
	$.logArea.value = '';
}

function ignoreProperty(key){
	var ignoreProperties = ["-measuredW", "-measuredH", "-locked", "-isInGroup", "customID"];
	
	return ignoreProperties.indexOf(key) > -1;
}

function balsamiqControlCorrespondence(controlName){
		
	var dict = SUPPORTED_COMPONENTS;
	
	return dict[controlName] ? dict[controlName] : dict['default'];//if not supported, creates a red view
}

function balsamiqPropertyCorrespondence(propName, controlClass){

	var dict = {
		"-w":"width",
		"-h":"height",
		"-x":"left",
		"-y":"top",
		// "-measuredW":"width",
		// "-measuredH":"height",
		"-zOrder":"zIndex",
		"controlProperties":"controlProperties", 
		"-locked":"locked",
		"-isInGroup":"isInGroup",
		"-controlID":"controlID",
		// "text":"findTextKey()",
		"":"",
	};
	
	return dict[propName] ? dict[propName]: "prop_" + propName;
}

function convertJSON2XML() {
	var xotree = new XML.ObjTree();
	var json = eval("(" + $.balsamiqXmlArea.value + ")");
	$.xmlArea.value = formatXml(xotree.writeXML(json)); 
};

var formatXml = function(xml) {
	var reg = /(>)(<)(\/*)/g;
	var wsexp = / *(.*) +\n/g;
	var contexp = /(<.+>)(.+\n)/g;
	xml = xml.replace(reg, '$1\n$2$3').replace(wsexp, '$1\n').replace(contexp, '$1\n$2');
	var pad = 0;
	var formatted = '';
	var lines = xml.split('\n');
	var indent = 0;
	var lastType = 'other';
	// 4 types of tags - single, closing, opening, other (text, doctype, comment) - 4*4 = 16 transitions
	var transitions = {
		'single->single' : 0,
		'single->closing' : -1,
		'single->opening' : 0,
		'single->other' : 0,
		'closing->single' : 0,
		'closing->closing' : -1,
		'closing->opening' : 0,
		'closing->other' : 0,
		'opening->single' : 1,
		'opening->closing' : 0,
		'opening->opening' : 1,
		'opening->other' : 1,
		'other->single' : 0,
		'other->closing' : -1,
		'other->opening' : 0,
		'other->other' : 0
	};

	for (var i = 0; i < lines.length; i++) {
		var ln = lines[i];
		var single = Boolean(ln.match(/<.+\/>/));
		// is this line a single tag? ex. <br />
		var closing = Boolean(ln.match(/<\/.+>/));
		// is this a closing tag? ex. </a>
		var opening = Boolean(ln.match(/<[^!].*>/));
		// is this even a tag (that's not <!something>)
		var type = single ? 'single' : closing ? 'closing' : opening ? 'opening' : 'other';
		var fromTo = lastType + '->' + type;
		lastType = type;
		var padding = '';

		indent += transitions[fromTo];
		for (var j = 0; j < indent; j++) {
			padding += '\t';
		}
		if (fromTo == 'opening->closing')
			formatted = formatted.substr(0, formatted.length - 1) + ln + '\n';
		// substr removes line break (\n) from prev loop
		else
			formatted += padding + ln + '\n';
	}

	return formatted;
}; 


