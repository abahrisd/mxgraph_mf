/**
 * Load and set privilege
 */
function DataLoader(editorUi, styleUrl, cellsUrl)
{
    this.editorUi = editorUi;
    this.graph = this.editorUi.editor.graph;
    this.parent = this.graph.getDefaultParent();
    this.globalUsersCellX = 40;
    this.globalUsersCellY = 40;

    this.init(styleUrl,cellsUrl);
};

/**
 * Init seting privilege
 */
DataLoader.prototype.init = function(styleUrl,cellsUrl) {

    this.loadStylesheet(styleUrl);

    //loading from JSON OR(!) from XML

    //this.loadJSONData(cellsUrl);
    this.loadXMLData('fixtures/testnode.xml');

};


/**
 * Load stylesheet.xml from server and set it to graph
 */
DataLoader.prototype.loadJSONData = function(url){

    var _this = this;
    var onload = function(req){
        try{
            var responseData = JSON.parse(req.getText());

            if (responseData !== undefined){
                responseData.forEach(function(el){
                    _this.createCellFromUserObject(el);
                })
            }

            //export xml node, for debug only
            var encoder = new mxCodec();
            var styleEncoder = mxCodecRegistry.getCodec('mxStylesheet');
            var node = styleEncoder.encode(encoder,_this.graph.getStylesheet());
            console.log('export node',node);
            console.log('export node xml',mxUtils.getXml(node));

            //TODO send node on server

            //debug stuff
            //console.log(new mxCodec().encode(mxCodecRegistry.getCodec('mxStylesheet'),EditUI.editor.graph.getStylesheet()))


        } catch (e){
            console.log('Error while parsing JSON ',e.stack);
        }
    };

    var onerror = function(req){
        mxUtils.alert('Error while getting diagram from server');
    };

    new mxXmlRequest(url, 'key=value').send(onload, onerror);
}


/**
 * Load stylesheet.xml from server and set it to graph
 */
DataLoader.prototype.loadXMLData = function(url){

    var _this = this;
    var editor = this.editorUi.editor;

    var onload = function(req){
        try{
            var xml = req.getText();

            var doc = mxUtils.parseXml(xml);
            editor.setGraphXml(doc.documentElement);
            editor.setModified(false);

            //export xml node, for debug only
            var encoder = new mxCodec();
            var styleEncoder = mxCodecRegistry.getCodec('mxStylesheet');
            var node = styleEncoder.encode(encoder,_this.graph.getStylesheet());
            console.log('export node from xml load',node);
            console.log('export node from xml load xml',mxUtils.getXml(node));

            //TODO send node on server

            //debug stuff
            //console.log(new mxCodec().encode(mxCodecRegistry.getCodec('mxStylesheet'),EditUI.editor.graph.getStylesheet()))


        } catch (e){
            console.log('Error while parsing JSON ',e.stack);
        }
    };

    var onerror = function(req){
        mxUtils.alert('Error while getting diagram from server');
    };

    new mxXmlRequest(url, 'key=value').send(onload, onerror);
}


/**
 * Create vetecies from object
 * obj decoded from JSON
 * return void
 */
DataLoader.prototype.createCellFromUserObject = function(obj){

    var doc = mxUtils.createXmlDocument();
    var node = doc.createElement('UserNode');
    var graph = this.graph;
    var parent = this.parent;
    var globalUsersCellX = this.globalUsersCellX;
    var globalUsersCellY = this.globalUsersCellY;

    //set title
    node.setAttribute('label', obj.title?obj.title:'UserLabel');

    //set attributes, except title
    for (var key in obj) {
        //don't care about obj.hasOwnProperty(key) con obj created from json
        if (key === 'title') {
            continue;
        }
        node.setAttribute(key, obj[key]);
    }

    //var style = {};
    //style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
    //style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
    //style[mxConstants.STYLE_ROUNDED] = 1;
    //style[mxConstants.STYLE_FILLCOLOR] = 'red';
    //graph.getStylesheet().putCellStyle('custom', style);
    //EditUI.editor.graph.getStylesheet().putCellStyle('custom', style);

    //mxStyleRegistry.putValue('custom', style);

    //console.log('node', node);

    //var newCell =
    //place new cell
    this.parent = graph.insertVertex(parent, null, node, globalUsersCellX, globalUsersCellY, 80, 30/*, 'custom'*/);
    //this.globalUsersCellX += 40;
    //this.globalUsersCellY += 40;
}

/**
 * Load stylesheet.xml from server and set it to graph
 */
DataLoader.prototype.loadStylesheet = function(url){

    var _this = this;
    var req = mxUtils.load(url);
    var root = req.getDocumentElement();
    var dec = new mxCodec(root.ownerDocument);
    var nodstyle = dec.decode(root, _this.graph.stylesheet);

    console.log('nodstyle',nodstyle);
}
