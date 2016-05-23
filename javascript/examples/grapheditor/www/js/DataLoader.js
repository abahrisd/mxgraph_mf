/**
 * ConstructLoad and set privilege
 */
function DataLoader(editorUi) {
    this.editorUi = editorUi;
    this.graph = this.editorUi.editor.graph;
    this.parent = this.graph.getDefaultParent();
    this.globalUsersCellX = 40;
    this.globalUsersCellY = 40;

    this.stylesheet = '';
    this.linkTypes = '';
    this.objectTypes = '';

    //TODO check is this declaration is correct
    //this.origin = window.location.origin;
    //this.getPath = window.location.getPath;

    this.origin = 'http://217.74.43.104:8080';
    this.getPath = '/sd/services/rest/get/';
    this.funcPath = '/sd/services/rest/exec';

    //parsing url and get params
    this.queryStr = function () {
        // This function is anonymous, is executed immediately and
        // the return value is assigned to QueryString!
        var query_string = {};
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            // If first entry with this name
            if (typeof query_string[pair[0]] === "undefined") {
                query_string[pair[0]] = decodeURIComponent(pair[1]);
                // If second entry with this name
            } else if (typeof query_string[pair[0]] === "string") {
                var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
                query_string[pair[0]] = arr;
                // If third or later entry with this name
            } else {
                query_string[pair[0]].push(decodeURIComponent(pair[1]));
            }
        }
        return query_string;
    }();

    //this.init(this.queryStr);
};

/**
 * Init setting privilege
 */
DataLoader.prototype.init = function(queryStr) {

    //this.setAttributes(queryStr);
    //Nope
};

/**
 * Generate url from queryStr
 */
DataLoader.prototype.generateUrl = function(queryStr) {
    return (this.origin + this.getPath + queryStr.view + '?accessKey=' + queryStr.accessKey );
};

/**
 * Set styleseet from this.stylesheet
 */
DataLoader.prototype.setStylesheet = function(stylesheet) {

    var graph = this.graph;
    var doc = mxUtils.parseXml(stylesheet);
    var root = doc.documentElement;
    var dec = new mxCodec(root.ownerDocument);
    dec.decode(root, graph.stylesheet);
};

/**
 * Create store for linkTypes
 */
DataLoader.prototype.setLinkTypes = function(linkTypes) {
    this.editorUi.linkTypes = new UserStore(null, linkTypes, 'code');
};

/**
 * Create store for objectTypes
 */
DataLoader.prototype.setObjectTypes = function(objectTypes) {
    this.editorUi.objectTypes = new UserStore(null, objectTypes, 'code');
};

/**
 * Create store for objectTypes
 */
DataLoader.prototype.setAttributes = function() {
    var queryString = this.queryStr;

    var url = this.origin + this.funcPath + '?accessKey=' + queryString.accessKey + '&func=modules.mxGraph.getTypeAttributesJson&params=';

    //load local list of attributes
    this.editorUi.atributesDirectory = new UserStore(url, null, 'metaClass');
};

/**
 * Create store for objectTypes
 */
DataLoader.prototype.changePageTitle = function(title) {

    document.title = title;

    var menuBar = document.getElementsByClassName('geMenubar')[0];
    var titleName = document.createElement('span');

    titleName.style.float = 'right';
    titleName.style.padding = '6px 8px 6px 8px';
    titleName.style.fontSize = '11pt';
    titleName.style.color = 'rgb(120,120,120)';
    titleName.innerHTML = title;
    titleName.title = title;

    //add truncating to 50% width to title
    titleName.style.whiteSpace = 'nowrap';
    titleName.style.width = '50%';
    titleName.style.overflow = 'hidden';
    titleName.style.textAlign = 'right';
    titleName.style.textOverflow = 'ellipsis';
    titleName.style.oTextOverflow = 'ellipsis';

    menuBar.insertBefore(titleName, menuBar.firstChild);
};

/**
 * Load stylesheet.xml from server and set it to graph
 */
DataLoader.prototype.loadXMLData = function(){

    var _this = this;
    var url = this.generateUrl(_this.queryStr);
    var graph = this.graph;

    var onload = function(req){
        try{
            var responseData = JSON.parse(req.getText());

            if (responseData !== undefined){

                //set page title and page name on up right corner
                if (responseData.title){
                    _this.changePageTitle(responseData.title);
                }

                //load assosiated data, like stylesheet, linkTypes, objectTypes
                if (responseData.type){
                    if (responseData.type.UUID){

                        var secondQuery =  {};
                        secondQuery.accessKey = _this.queryStr.accessKey;
                        secondQuery.view = responseData.type.UUID;

                        var metaUrl = _this.generateUrl(secondQuery);
                        var res = _this.loadTypeData(metaUrl);

                        if (res.stylesheet){
                            _this.setStylesheet(res.stylesheet);
                        } else {
                            if (DEBUG){
                                console.log("Unable to set stylesheet");
                            }
                        }

                        if (res.linkTypes){
                            //var linkTypes = JSON.parse(res.linkTypes);
                            _this.setLinkTypes(JSON.parse(res.linkTypes));
                        } else {
                            if (DEBUG){
                                console.log("Unable to set linkTypes");
                            }
                        }

                        if (res.objectTypes){
                            //var objectTypes = JSON.parse(res.objectTypes);
                            _this.setObjectTypes(JSON.parse(res.objectTypes));
                        } else {
                            if (DEBUG){
                                console.log("Unable to set objectTypes");
                            }
                        }

                    } else {
                        if (DEBUG) {
                            console.log("Type of view not defined, cannot load stylesheet, linkTypes, objectTypes");
                        }
                    }
                }

                //if exits mxGraphModel try to show it
                if (responseData.mxGraphModel){
                    try {
                        var editor = _this.editorUi.editor;
                        var xml = responseData.mxGraphModel;
                        var doc = mxUtils.parseXml(xml);

                        editor.setGraphXml(doc.documentElement);
                        editor.setModified(false);
                    } catch(e) {
                        if (DEBUG){
                            console.log('Error while show mxGraphModel, trying show graph based on relevantData', e.stack);
                        }
                    }
                }
            }

        } catch (e){
            if (DEBUG) {
                console.log('Error while parsing JSON ', e.stack);
            }
        }
    };

    var onerror = function(req){
        mxUtils.alert('Error while getting diagram from server');
    };

    new mxXmlRequest(url, 'key=value', 'GET').send(onload, onerror);
}


/**
 * Load object type data, like stylesheet, linkTypes, objectTypes and store it in local variables
 */
DataLoader.prototype.loadTypeData = function(url) {

    var req = mxUtils.load(url);
    var responseData = JSON.parse(req.getText());
    var res = {};

    if (responseData.stylesheet){
        res.stylesheet = responseData.stylesheet;
    }

    if (responseData.linkTypes){
        res.linkTypes = responseData.linkTypes;
    }

    if (responseData.objectTypes){
        res.objectTypes = responseData.objectTypes;
    }

    return res;

};

/**
 * Load object type data, like stylesheet, linkTypes, objectTypes and store it in local variables
 */
DataLoader.prototype.sync = function() {

    var _this = this;
    var view_id = this.queryStr.view.split('$')[1];

    var url = (this.origin + this.funcPath + '?accessKey='+this.queryStr.accessKey + '&func=modules.mxGraph.relevantData&params=' + view_id);

    var graph = this.graph;
    var editor = this.editorUi.editor;

    var onload = function(req){
        try{
            var responseData = JSON.parse(req.getText());
            if (responseData !== undefined){

                //insert objects
                if (responseData.objects){
                    responseData.objects.forEach(function(el){
                        _this.createCellFromUserObject(el);
                    })
                }

                //insert links
                if (responseData.links){
                    responseData.links.forEach(function(el){

                        //TODO create structure for fast search cell by _metaClass
                        var source, target;

                        graph.getModel().getDescendants(graph.getDefaultParent()).forEach(function(cell){

                            if (cell && cell.getValue()){

                                if (cell.getValue().getAttribute('UUID') == el.source) {
                                    source = cell;
                                }

                                if (cell.getValue().getAttribute('UUID') == el.target) {
                                    target = cell;
                                }
                            }
                        });

                        if (source && target){
                            var newEdge = graph.insertEdge(graph.getDefaultParent(), null, null, source, target);

                            //TODO move in separate func
                            //add custom attrs
                            var val = graph.getModel().getValue(newEdge);

                            // Converts the value to an XML node
                            if (!mxUtils.isNode(val)) {
                                var doc = mxUtils.createXmlDocument();
                                var obj = doc.createElement('object');
                                obj.setAttribute('label', val || '');
                                val = obj;
                            }

                            val.setAttribute("source", el.source);
                            val.setAttribute("target", el.target);
                            val.setAttribute("typeCode", el.typeCode);

                            graph.getModel().setValue(newEdge, val);

                        }
                    });
                }

                _this.arrangeOrganic();

                editor.setModified(false);
            }
        } catch (e){
            if (DEBUG) {
                console.log('Error while parsing JSON ', e.stack);
            }
        }
    };

    var onerror = function(req){
        mxUtils.alert('Error while getting diagram from server');
    };

    new mxXmlRequest(url, null, 'GET').send(onload, onerror);
};

/**
 * Create vetecies from object
 * obj decoded from JSON
 * return void
 */
DataLoader.prototype.createCellFromUserObject = function(obj){

    var doc = mxUtils.createXmlDocument();
    var node = doc.createElement('UserNode');
    //var graph = this.graph;
    var graph = EditUI.editor.graph;
    var parent = this.parent;

    var width = '';
    var height = '';
    var titleLength = obj.title?obj.title.length:0;

    var globalUsersCellX = this.globalUsersCellX;
    var globalUsersCellY = this.globalUsersCellY;

    //set title
    node.setAttribute('label', obj.title?obj.title:'');

    //set attributes, except title
    if (obj.metaClass){
        var attrs = this.editorUi.atributesDirectory.getById(obj.metaClass);

        //идём по атрибутам и добавляем все атрибуты
        //потом идём по переданным значениям и если есть такой атрибут то

        node.setAttribute('metaClass', obj.metaClass);

        if (obj['UUID']){
            node.setAttribute('UUID', obj['UUID']);
        }

        for (var att in attrs.attributes){
            if (obj[att]){
                node.setAttribute(att, obj[att]);
            } else {
                node.setAttribute(att, '');
            }
        }

        var style = '';

        //TODO add other styles
        switch(obj.metaClass){
            case 'ae$bpstep':
                style = 'step';
                break;
        }
    }

    //adjust cell size by label length
    if (titleLength <= 40){
        width = 130;
        height = 50;
    } else if (titleLength <= 80){
        width = 140;
        height = 80;
    } else if (titleLength <= 120){
        width = 180;
        height = 80;
    } else if (titleLength <= 160){
        width = 220;
        height = 100;
    } else if (titleLength <= 200){
        width = 220;
        height = 110;
    } else {
        width = 265;
        height = 115;
    }

    //graph.insertVertex(parent, null, node, globalUsersCellX, globalUsersCellY, null, null, style);
    graph.insertVertex(parent, null, node, globalUsersCellX, globalUsersCellY, width, height, style);

    //var cell = graph.insertVertex(parent, null, node, globalUsersCellX, globalUsersCellY, width, height, style);
    //console.log("cell", cell);
    this.globalUsersCellX += 10;
    this.globalUsersCellY += 10;
}

/**
 * Load stylesheet from server and set it to graph, from server shold came XML!
 */
DataLoader.prototype.loadStylesheetDoc = function(url){

    var _this = this;
    var req = mxUtils.load(url);
    var root = req.getDocumentElement();
    var dec = new mxCodec(root.ownerDocument);
    dec.decode(root, _this.graph.stylesheet);

};

/**
 * Load stylesheet from server and set it to graph, from server shold came XML!
 */
DataLoader.prototype.arrangeOrganic = function(){

    var graph = this.graph;

    //TODO call this from menu items
    var layout = new mxHierarchicalLayout(graph, mxConstants.DIRECTION_NORTH);

    this.editorUi.executeLayout(function(){
        var selectionCells = graph.getSelectionCells();
        layout.execute(graph.getDefaultParent(), selectionCells.length == 0 ? null : selectionCells);
    }, true);

};

/**
 * Export xml node
 */
DataLoader.prototype.exportXMLNode = function(){

    //export xml node, for debug only
    var graph = this.graph;
    var encoder = new mxCodec();
    var styleEncoder = mxCodecRegistry.getCodec('mxStylesheet');
    var node = styleEncoder.encode(encoder,graph.getStylesheet());

    //console.log('export node',node);
    //console.log('export node xml',mxUtils.getXml(node));

    //TODO send node on server
    //debug stuff
    //console.log(new mxCodec().encode(mxCodecRegistry.getCodec('mxStylesheet'),EditUI.editor.graph.getStylesheet()))

};
