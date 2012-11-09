
Wellcome to alljoy
======

"Alljoy" is a set of experimental javascript tools that work around Alloy, the Titanium MVC framework.

It is just a place to put tools and ideas for Alloy all together. There's no road map nor a clear aim. So, you are warned. :)

Now Alljoy includes 2 tools:

- A JSON <-> XML converter. Convert XML alloy views to JSON and viceversa.

- A Balsamiq to XML/TSS converter. Export a balsamiq mock-up to XML, paste in and the tool will generate the xml and tss files to use in your alloy project.

You can live test alljoy in http://www.titantricks.com/alljoy

A video with a brief demo is also available here http://www.youtube.com/watch?v=IR1BtB3PcLM


JSON <-> XML converter
====

Is just something experimental, I'm not sure if it can be useful for anybody but me. 

Balsamiq to Alloy XML/TSS converter
====

Export your balsamiq mock-up to XML and generate the Alloy XML and TSS files for your titanium project.

To export the mock-up in balsamiq, click File > Export to XML or type cmd+E.

Cautions:
- Use the top left corner of your mock-up as coordinates reference point. So, don't create your mock-up in the middle of your 24" HD monitor.
- Export more than 1 component (that means, at least 2)
- Groups are not supported by now. Do not use groups.
- If a component is not resized in balsamiq, its width/height is set to Ti.UI.SIZE, but sometimes results in unexpected results. So, is better so force resize all components in balsamiq so the size is correctly translated
- Color codes still doesnt' work.
- TableViews and pickers does not fill the rows with data.

Components Supported:

Next components are supported. If any other component is used, it is replaced by a red view.

	"com.balsamiq.mockups::Button"
	"com.balsamiq.mockups::Switch"
	"com.balsamiq.mockups::Map"
	"com.balsamiq.mockups::VideoPlayer"
	"com.balsamiq.mockups::Image"
	"com.balsamiq.mockups::List" --> converted to TableView
	"com.balsamiq.mockups::iPhoneMenu" --> converted to TableView
	"com.balsamiq.mockups::iPhonePicker"
	"com.balsamiq.mockups::Canvas" --> converted to View
	"com.balsamiq.mockups::SearchBox"
	"com.balsamiq.mockups::Label"
	"com.balsamiq.mockups::SubTitle"
	"com.balsamiq.mockups::Title"
	"com.balsamiq.mockups::TextInput"
	"com.balsamiq.mockups::TextArea"
	"com.balsamiq.mockups::HSlider"
	"com.balsamiq.mockups::ProgressBar" --> requires call show() method in your controller
	
	
Credits
====

Alljoy:

Javier Rayon, 2012

twitter: @jrayon

mail: javier at criteriastudio . com

web: http://www.criteriastudio.com


Libraries:
JKLDumper, by Kawasaki Yusuke

ObjTree, by Kawasaki Yusuke http://www.kawa.net/works/js/xml/objtree-e.html
 