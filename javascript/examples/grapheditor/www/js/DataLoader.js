/**
 * ConstructLoad and set privilege
 */
function DataLoader(editorUi) {
    this.editorUi = editorUi;
    this.graph = this.editorUi.editor.graph;
    this.parent = this.graph.getDefaultParent();
    this.globalUsersCellX = 40;
    this.globalUsersCellY = 40;
    this.title = '';
    this.mxGraphModelData = '';

    this.stylesheet = '';
    this.linkTypes = '';
    this.objectTypes = '';
    this.maxDiagPoolWidth = null;
    this.pools = [];

    //TODO check is this declaration is correct
    //this.origin = window.location.origin;
    //this.getPath = window.location.getPath;

    this.origin = 'http://217.74.43.104:8080';
    this.getPath = '/sd/services/rest/get/';
    this.funcPath = '/sd/services/rest/exec';

    //parsing url and get params
    this.queryStr = globalQueryString;

    //this.init(this.queryStr);
}

/**
 * Init setting privilege
 */
/*DataLoader.prototype.init = function (queryStr) {

    //Nope
};*/

/**
 * Generate url from queryStr
 */
DataLoader.prototype.generateUrl = function (queryStr) {
    return (this.origin + this.getPath + queryStr.view + '?accessKey=' + queryStr.accessKey );
};

/**
 * Set styleseet from this.stylesheet
 */
DataLoader.prototype.setStylesheet = function (stylesheet) {

    var graph = this.graph;
    var doc = mxUtils.parseXml(stylesheet);
    var root = doc.documentElement;
    var dec = new mxCodec(root.ownerDocument);
    dec.decode(root, graph.stylesheet);
};

/**
 * Create store for linkTypes
 */
DataLoader.prototype.setLinkTypes = function (linkTypes) {
    this.editorUi.linkTypes = new UserStore(null, linkTypes, 'code');

    //init edge validation
    new RelValidator(this.editorUi);
};

/**
 * Create store for objectTypes
 */
DataLoader.prototype.setObjectTypes = function (objectTypes) {
    this.editorUi.objectTypes = new UserStore(null, objectTypes, 'code');
};

/**
 * Create store for connectionTypes
 */
DataLoader.prototype.setConnectionTypes = function (objectTypes) {
    this.editorUi.connectionTypes = new UserStore(null, objectTypes, 'code');
};

/**
 * Create store for forbiddenConnections
 */
DataLoader.prototype.setForbiddenConnections = function (objectTypes) {
    this.editorUi.forbiddenConnections = objectTypes;
    //this.editorUi.forbiddenConnections = new UserStore(null, objectTypes, 'connectionType');
};

/**
 * Create store for forbiddenConnections
 */
DataLoader.prototype.setImpliedContainment = function (objectTypes) {
    this.editorUi.impliedContainment = new UserStore(null, objectTypes, 'type');
    //this.editorUi.forbiddenConnections = new UserStore(null, objectTypes, 'connectionType');
};

/**
 * Create store for objectTypes
 */
DataLoader.prototype.setAttributes = function () {
    var queryString = this.queryStr;

    var url = this.origin + this.funcPath + '?accessKey=' + queryString.accessKey + '&func=modules.mxGraph.getTypeAttributesJson&params=';

    //load local list of attributes
    this.editorUi.atributesDirectory = new UserStore(url, null, 'metaClass');
};

/**
 * Create store for objectTypes
 */
DataLoader.prototype.changePageTitle = function () {

    var title = this.title;
    var menuBar = document.getElementsByClassName('geMenubar')[0];
    var titleName = document.createElement('span');

    document.title = title;

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
DataLoader.prototype.loadXMLData = function () {

    var _this = this;
    var url = this.generateUrl(_this.queryStr);
    var graph = this.graph;
    var loadMask = this.editorUi.loadMask;
    loadMask.setLoadText('Загрузка...');

    var onload = function (req) {
        loadMask.hide();
        try {
            var responseData = JSON.parse(req.getText());

            if (responseData !== undefined) {

                //set page title and page name on up right corner
                if (responseData.title) {
                    _this.title = responseData.title;
                }

                //if exits mxGraphModel save it in editor param
                if (responseData.mxGraphModel) {
                    _this.mxGraphModelData = responseData.mxGraphModel;
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
                            _this.loadStylesheetDoc('./fixtures/stylesheet.xml');
                            if (DEBUG){
                                console.log("Unable to set stylesheet");
                            }
                        }

                        //console.log("res", res);
                        if (res.specification){
                            var spec = JSON.parse(res.specification);
                            //console.log("spec", spec);

                            if (spec.linkTypes){
                                //var linkTypes = JSON.parse(res.linkTypes);
                                _this.setLinkTypes(spec.linkTypes);
                            } else {
                                if (DEBUG) {
                                    console.log("Unable to set linkTypes");
                                }
                            }

                            if (spec.objectTypes){
                                //var objectTypes = JSON.parse(res.objectTypes);
                                _this.setObjectTypes(spec.objectTypes);
                            } else {
                                if (DEBUG) {
                                    console.log("Unable to set objectTypes");
                                }
                            }

                            if (spec.connectionTypes){
                                //var objectTypes = JSON.parse(res.objectTypes);
                                _this.setConnectionTypes(spec.connectionTypes);
                            } else {
                                if (DEBUG) {
                                    console.log("Unable to set connectionTypes");
                                }
                            }

                            if (spec.forbiddenConnections){
                                //var objectTypes = JSON.parse(res.objectTypes);
                                _this.setForbiddenConnections(spec.forbiddenConnections);
                            } else {
                                if (DEBUG) {
                                    console.log("Unable to set forbiddenConnections");
                                }
                            }

                            if (spec.impliedContainment){
                                //var objectTypes = JSON.parse(res.objectTypes);
                                //console.log("impliedContainment", spec.impliedContainment);
                                _this.setImpliedContainment(spec.impliedContainment);
                            } else {
                                if (DEBUG) {
                                    console.log("Unable to set impliedContainment");
                                }
                            }
                        }


                    } else {
                        if (DEBUG) {
                            console.log("Type of view not defined, cannot load stylesheet, linkTypes, objectTypes");
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
        loadMask.hide();
        mxUtils.alert('Error while getting diagram from server');
    };

    loadMask.show();
    new mxXmlRequest(url, 'key=value', 'GET', false).send(onload, onerror);
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

    if (responseData.specification){
        res.specification = responseData.specification;
    }

    return res;
};

/**
 * Arrange entries in given cell
 * @parentCell <mxCell>
 */
DataLoader.prototype.arrangeEntrys = function(parentCell) {
    var graph = this.graph;

    var childs = graph.getModel().getChildVertices(parentCell);
    var newGroup = graph.groupCells(parentCell, 0, childs);
    var layout = new mxHierarchicalLayout(graph, mxConstants.DIRECTION_WEST);
    //var layout = new mxStackLayout(graph);

    layout.parentBorder = 40;
    layout.border = 40;
    layout.resizeParent = true;
	layout.disableEdgeStyle = false;
    layout.execute(newGroup);

	//save pools and maxDiagPoolWidth to set al pools width equal
	if ( parentCell.getValue() && parentCell.getValue().getAttribute('metaClass') === 'ae$participant' ) {
        this.pools.push(parentCell);
        if ( parentCell.geometry.width > this.maxDiagPoolWidth ){
            this.maxDiagPoolWidth = parentCell.geometry.width;
        }
	}
}

/**
 * Search cells in which we should put clone of given cell.
 * Search going according linkChain
 * @cell <mxCell>
 * @linkChain <object>
 */
DataLoader.prototype.getCellTargets = function(cell, linkChain) {
    var cellTargets = [];
    var _this = this;
    var graph = this.graph;

    //var linkChain = impliedContainment[cont].linkChain;

    linkChain.forEach(function(link){
        var reverse = link['reverse'];
        var tmpCellTargets = [];
        var edges = [];
        var linkBehaviour;

        if (_this.editorUi.linkTypes && _this.editorUi.linkTypes.getById(link.linkType) && _this.editorUi.linkTypes.getById(link.linkType).behaviour){
            linkBehaviour = _this.editorUi.linkTypes.getById(link.linkType).behaviour;
        }

        switch(linkBehaviour){
            case 'connection':
                if (cellTargets.length > 0){
                    cellTargets.forEach(function(cellTrg){
                        edges = graph.getModel().getEdges(cellTrg, reverse, !reverse, false);

                        //get targets
                        edges.forEach(function(edge){
                            tmpCellTargets.push(edge.getTerminal(reverse));
                        });
                    });
                } else {
                    edges = graph.getModel().getEdges(cell, reverse, !reverse, false);

                    //get targets
                    edges.forEach(function(edge){
                        tmpCellTargets.push(edge.getTerminal(reverse));
                    });
                }

                cellTargets = tmpCellTargets;
                tmpCellTargets = [];

                break;
            case 'containment':
                var parent;
                if (cellTargets.length > 0){
                    cellTargets.forEach(function(cellTrg){
                        if (reverse){
                            parent = cellTrg.getParent();
                            tmpCellTargets.push(parent);
                        } else {
                            if (DEBUG){
                                console.log("Not realized content");
                            }
                        }
                    });
                } else {
                    if (DEBUG){
                        console.log("Containment shouldn't be first item in chain");
                    }
                }
                if (parent){
                    cellTargets = tmpCellTargets;
                    tmpCellTargets = [];
                }
                break;
            default:
                if (DEBUG){
                    console.log("Found unwaited linkBehaviour - " + linkBehaviour);
                }
        }
    });

    return cellTargets;
};

/**
 * Add new edge for given source and target with attrs from el object
 * source mxCell
 * target mxCell
 * el object
 */
DataLoader.prototype.cloneCellInTargets = function(cell, cellTargets) {

    var _this = this;
    var graph = this.graph;

    if (cellTargets.length > 0){

        cellTargets = tcpUtils.uniq(cellTargets);
        cellTargets.forEach(function(cellTrg){

            //var newCell = graph.cloneCells([cell])[0];
            var newCells = [];

            //var cellEdges = graph.getModel().getEdges(cell, incoming, outgoing, false);
            var incomingEdges = graph.getModel().getEdges(cell, true, false, false);
            var outcomingEdges = graph.getModel().getEdges(cell, false, true, false);

            var addEdges = [];

            incomingEdges.forEach(function(edge){

                var el = {};
                if (edge.getValue() && edge.getValue().getAttribute){
                    el.source = edge.getValue().getAttribute('source');
                    el.target = edge.getValue().getAttribute('target');
                    el.typeCode = edge.getValue().getAttribute('typeCode');
                }

                if  (edge.source && edge.source.getParent().id === cellTrg.id){

                    var newCell = graph.cloneCells([cell])[0];
                    newCells.push(newCell);

                    addEdges.push({
                        target: newCell,
                        source: edge.source,
                        el: el
                    });
                }
            });

            outcomingEdges.forEach(function(edge){

                var el = {};
                if (edge.getValue() && edge.getValue().getAttribute){
                    el.source = edge.getValue().getAttribute('source');
                    el.target = edge.getValue().getAttribute('target');
                    el.typeCode = edge.getValue().getAttribute('typeCode');
                }

                if (edge.target && edge.target.getParent().id === cellTrg.id){

                    var newCell = graph.cloneCells([cell])[0];
                    newCells.push(newCell);

                    addEdges.push({
                        target: edge.target,
                        source: newCell,
                        el: el
                    });
                }
            });

            graph.groupCells(cellTrg, 10, newCells);

            addEdges.forEach(function(edge){
                _this.addEdgeWithAttrs(edge.el, edge.source, edge.target, cellTrg);
            });

        });

        graph.getModel().remove(cell);
    }
};


/**
 * Add new edge for given source and target with attrs from el object
 * source mxCell
 * target mxCell
 * el object
 */
DataLoader.prototype.addEdgeWithAttrs = function(el, source, target, parent) {
    var graph = this.graph;
    var style = null;

    if (el.typeCode) {
        var connectionType = this.editorUi.linkTypes.getConnectionStyle(el.typeCode);
        var connectionStencil = this.editorUi.stencilsData.getByMetaClass(connectionType);
        style = connectionStencil && connectionStencil.code;
    }

    var newEdge = graph.insertEdge(parent, null, null, source, target, style);

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
};

/**
 * Load object type data, like stylesheet, linkTypes, objectTypes and store it in local variables
 */
DataLoader.prototype.sync = function() {

    var _this = this;
    var viewId = this.queryStr.view.split('$')[1];

    var url = (this.origin + this.funcPath + '?accessKey='+this.queryStr.accessKey + '&func=modules.mxGraph.relevantData&params=' + viewId);

    var graph = this.graph;
    var editor = this.editorUi.editor;
    var loadMask = this.editorUi.loadMask;
    loadMask.setLoadText('Синхронизация...');

    var onload = function(req){
        loadMask.hide();
        try{
            var responseData = JSON.parse(req.getText());
            console.log("responseData", responseData);
            if (responseData !== undefined){

                //insert objects
                if (responseData.objects){
                    responseData.objects.forEach(function(el){
                        _this.createCellFromUserObject(el);
                    });
                }

                var parents = [];

                //insert links
                if (responseData.links){
                    var targetsToDel = [];

                    //insert participant links (child-parent)
                    responseData.links.forEach(function(el){
                        if (el.typeCode === 'participant2step'){

                            //TODO create structure for fast search cell by _metaClass
                            var source, target;

                            graph.getModel().getDescendants(graph.getDefaultParent()).forEach(function(cell){
                                if (cell && cell.getValue()){
                                    if (cell.getValue().getAttribute('UUID') === el.source) {
                                        source = cell;
                                    }
                                    if (cell.getValue().getAttribute('UUID') === el.target) {
                                        target = cell;
                                    }
                                }
                            });

                            if (source && target){
                                var newTarget = graph.cloneCells([target])[0];
                                graph.groupCells(source, 10, [newTarget]);
                                targetsToDel.push(target);
                                parents.push(source);
                            }
                        }
                    });

                    //remove cells, which we copy
                    targetsToDel.forEach(function(trg){
                        graph.getModel().remove(trg);
                    });

                    //insert connection links (arrows)
                    responseData.links.forEach(function(el){

                        //TODO create structure for fast search cell by _metaClass
                        var source, target;

                        graph.getModel().getDescendants(graph.getDefaultParent()).forEach(function(cell){
                            if (cell && cell.getValue()){
                                if (cell.getValue().getAttribute('UUID') === el.source) {
                                    source = cell;
                                }
                                if (cell.getValue().getAttribute('UUID') === el.target) {
                                    target = cell;
                                }
                            }
                        });

                        if (source && target){
                            if (el.typeCode !== 'participant2step'){
                                _this.addEdgeWithAttrs(el, source, target, graph.getDefaultParent());
                            }
                        }
                    });
                }

                /*
                * Ищем все ячейки с metaClass = impliedContainment item
                * Нашли ячейку - смотрим, есть ли у неё связи, соответствующие linkChain.
                * Если у ячейки есть связи соответствующие linkChain, то
                *   Нужно скопировать все edge до родителя. Указать кем является эта ячейка для связи, в зависимости от reverse
                *   Клонируем ячейку, переносим её в нового родителя, проставляем ей связи.
                *   EZ.
                **/

                var impliedContainmentObj = _this.editorUi.impliedContainment;

                if (impliedContainmentObj.getCount() > 0){

                    var impliedContainment = impliedContainmentObj.getAll();

                    for (var cont in impliedContainment){
                        if (Object.prototype.hasOwnProperty.call(impliedContainment, cont)){
                            //cont = type
                            graph.getModel().getDescendants(graph.getDefaultParent()).forEach(function(cell){

                                //get cells with metaClass = cont
                                if (cell && cell.getValue() && cell.getValue().getAttribute('metaClass') === cont){
                                    if (impliedContainment[cont].linkChain && impliedContainment[cont].linkChain.length > 0){

                                        var cellTargets = _this.getCellTargets(cell, impliedContainment[cont].linkChain);

                                        //array for target cells on each itteration
                                        _this.cloneCellInTargets(cell, cellTargets);
                                    }
                                }
                            });
                        }
                    }
                }

                if (parents.length > 0){

                    //arrange obj inside pools
                    parents.forEach(function(parentCell){
                        _this.arrangeEntrys(parentCell);
                    });

                    if (_this.maxDiagPoolWidth && _this.pools.length > 0){
                        _this.pools.forEach(function(pool){
                            pool.geometry.width = _this.maxDiagPoolWidth;
                        });
                    }

                    //arrange pools vertical
                    var newGroup = graph.groupCells(graph.getDefaultParent(), 0, parents);
                    var layout = new mxStackLayout(graph, false, 10);
                    layout.border = 0;
                    layout.resizeParent = true;
                    layout.execute(newGroup);

                    //push arrow on first plan to see connections betwen pool and outer world
                    graph.setSelectionCells(graph.getModel().getChildEdges(graph.getDefaultParent()));
                    graph.orderCells(false);
                    graph.clearSelection();
                } else {
                    _this.arrangeHorizontal();
                    //_this.arrangeOrganic();
                }

                editor.setModified(false);
                //graph.refresh();
            }
        } catch (e){
            if (DEBUG) {
                console.log('Error while parsing JSON ', e.stack);
            }
        }
    };

    var onerror = function(req){
        loadMask.hide();
        mxUtils.alert('Error while getting diagram from server');
    };

    loadMask.show();
    new mxXmlRequest(url, null, 'GET').send(onload, onerror);
};

/**
 * Create vetecies from object
 * obj decoded from JSON
 * return void
 */
DataLoader.prototype.createCellFromUserObject = function(obj, linkParents){

    var doc = mxUtils.createXmlDocument();
    var node = doc.createElement('UserNode');
    //var graph = this.graph;
    var editor = this.editorUi;
    var graph = editor.editor.graph;
    var parent = this.parent;
    var stencilsData = editor.stencilsData;
    //var baseParent = this.parent;
    //var parent;

    //base width and height for stencils without style
    var width = stencilsData.baseWidth;
    var height = stencilsData.baseHeight;

    var style = 'whiteSpace=wrap;';
    var titleLength = obj.title?obj.title.length:0;
    var newValue = null;

    var globalUsersCellX = this.globalUsersCellX;
    var globalUsersCellY = this.globalUsersCellY;

    //set title


    //set attributes, except title
    if (obj.metaClass){

        var metaClass = obj.metaClass;
        var attrToShow = 'title';
        var atributesDirectory = this.editorUi.atributesDirectory;
        var attrs = atributesDirectory.getById(metaClass);

        if (attrs){
            if (attrs.nameAttribute){
                attrToShow = attrs.nameAttribute;
            }
        }

        node.setAttribute('label', obj[attrToShow] || '');

		if (obj[attrToShow]){
			titleLength = obj[attrToShow].length;
			//console.log("obj", obj);
			//console.log("attrToShow", attrToShow);
		}

        //var attrs = this.editorUi.atributesDirectory.getById(metaClass);

        //идём по атрибутам и добавляем все атрибуты
        //потом идём по переданным значениям и если есть такой атрибут то
        node.setAttribute('metaClass', metaClass);

        if (obj['UUID']){
            node.setAttribute('UUID', obj['UUID']);
        }

        //console.log("attrs.attributes", attrs.attributes);
        for (var att in attrs.attributes){
            if (obj[att]){
                node.setAttribute(att, obj[att]);
            } else {
                node.setAttribute(att, '');
            }
        }
    }

    //adjust cell size by label length
    //var widthHeight = this.getWidthHeight(titleLength);
    //width = widthHeight.width;
    //height = widthHeight.height;

    var templateAttribute = editor.objectTypes.getTemplateAttribute(metaClass);

    if (templateAttribute){
        newValue = obj[templateAttribute];
    } else {
        var baseStyle = editor.objectTypes.getBaseStyle(metaClass);
        style = baseStyle?baseStyle:style;
    }

    if (newValue) {
        var group = editor.objectTypes.getGroup(metaClass, newValue);
        style = editor.objectTypes.getElementStyle(metaClass, newValue);
    }

    var code = editor.objectTypes.getElementCode(metaClass, newValue);
    if (code){
        width = editor.stencilsData.getWidth(code);
        height = editor.stencilsData.getHeight(code);
    }

    //if it's group = action, get cell from stencilsStore
    if (group === 'action'){
        var newStyle = editor.objectTypes.getElementStyle(metaClass, newValue);
        var protoCell = editor.stencilsStore.getById(newStyle);

        if (protoCell.cell){
            protoCell = protoCell.cell;

            var newProtoCell = graph.moveCells(protoCell, null, null, true, parent)[0];

            newProtoCell.setValue(node);


            var widthHeight = this.getWidthHeight(titleLength);
            width = widthHeight.width;
            height = widthHeight.height;

            newProtoCell.getGeometry().width = width;
            newProtoCell.getGeometry().height = height;
        }
    } else {
        //graph.insertVertex(parent, null, node, globalUsersCellX, globalUsersCellY, null, null, style);
        graph.insertVertex(parent, null, node, globalUsersCellX, globalUsersCellY, width, height, style);
    }

    this.globalUsersCellX += 10;
    this.globalUsersCellY += 10;
};

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
 * get width and height based on title length
 */
DataLoader.prototype.getWidthHeight = function(titleLength){

    var width='';
    var height='';

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
    }  else if (titleLength <= 250){
        width = 280;
        height = 130;
    }  else if (titleLength <= 300){
        width = 320;
        height = 170;
    }  else if (titleLength <= 350){
        width = 370;
        height = 200;
    }   else if (titleLength <= 400){
        width = 400;
        height = 220;
    }   else if (titleLength <= 500){
        width = 410;
        height = 210;
    } else {
        width = 455;
        height = 296;
    }

    return {width:width, height:height};

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
 * Load stylesheet from server and set it to graph, from server shold came XML!
 */
DataLoader.prototype.arrangeHorizontal = function(){
    var graph = this.graph;

    //TODO call this from menu items
    var layout = new mxHierarchicalLayout(graph, mxConstants.DIRECTION_WEST);
    this.editorUi.executeLayout(function()
    {
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

/**
 * Export xml node
 */
DataLoader.prototype.setMxGraphModel = function(){
    try{
        var editor = this.editorUi.editor;
        var xml = this.mxGraphModelData;
        var doc = mxUtils.parseXml(xml);

        editor.setGraphXml(doc.documentElement);
        editor.setModified(false);
    } catch(e){
        if(DEBUG){
            console.log("Error while setting mxGraphModel", e.stack);
        }
    }
};
