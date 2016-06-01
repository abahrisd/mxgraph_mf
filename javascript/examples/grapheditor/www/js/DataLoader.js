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

    //TODO check is this declaration is correct
    //this.origin = window.location.origin;
    //this.getPath = window.location.getPath;

    this.origin = 'http://217.74.43.104:8080';
    this.getPath = '/sd/services/rest/get/';
    this.funcPath = '/sd/services/rest/exec';

    //parsing url and get params
    this.queryStr = globalQueryString;

    //this.init(this.queryStr);
};

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
//debugger;
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
/*
    if (responseData.linkTypes){
        res.linkTypes = responseData.linkTypes;
    }

    if (responseData.objectTypes){
        res.objectTypes = responseData.objectTypes;
    }*/

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
    var loadMask = this.editorUi.loadMask;
    loadMask.setLoadText('Синхронизация...');

    var onload = function(req){
        loadMask.hide();
        try{
            var responseData = JSON.parse(req.getText());
            console.log("responseData", responseData);
            if (responseData !== undefined){

                /*var linkParents = {};

                if (responseData.links){
                    responseData.links.forEach(function(el){
                        if (el.typeCode === 'participant2step'){
                            linkParents[el.target] = el.source;
                        }
                    });
                }*/

                /*
                * Как будем размещать объекты:
                * У нас есть объекты и линки - связи между объектами
                * Сначало берём все линки с типом participant2step - вложения (родители и дети)
                * Для каждого объекта определяем родителя.
                * TODO Если появится вложение больше 1 уровня - для каждого объекта определяем количество детей, сортируем все объекты от наибольшего к наименьшему, что бы определить последовательность доабвления обхектов на диаграмму
                * Сначало добавляем на диаграмму объекты у которых есть дети, потом все остальные.
                * source = parent
                * Дальше, для каждого объекта у которого есть дети - создаём группу из детей и располагаем их красиво - применяем к ним layout.execute()
                * */

                /*var setParent = function(target, source){
                    responseData.objects.some(function(obj){
                        if (obj.UUID === source){
                            obj.parent = target;
                            return true;
                        }
                        return false;
                    })
                }*/

                var parents = [];
                //var childs = [];
                /*if (responseData.links){
                    responseData.links.forEach(function(el){

                        if (el.typeCode === 'participant2step'){
                            if (el.target && el.source){
                                //parents.push(el.source);
                                //ищем цел с таким uuid= el.source и добавляем ему атрибут parent = el.parent
                                //setParent(el.target, el.source);
                            }
                        }
                    });
                }*/

                //parents = uniq(parents);

                //insert objects
                if (responseData.objects){
                    //_this.createCellsFromObject(responseData.objects, linkParents);
                    responseData.objects.forEach(function(el){
                        _this.createCellFromUserObject(el);
                    });
                }

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
                                    if (cell.getValue().getAttribute('UUID') == el.source) {
                                        source = cell;
                                    }
                                    if (cell.getValue().getAttribute('UUID') == el.target) {
                                        target = cell;
                                    }
                                }
                            });

                            if (source && target){
                                var newTarget = graph.cloneCells([target])[0];
                                targetsToDel.push(target);
                                graph.groupCells(source, 10, [newTarget]);
                                parents.push(source);

                                //EditUI.editor.graph.getModel().getCell(35).setParent(EditUI.editor.graph.getModel().getCell(34));
                                //EditUI.editor.graph.groupCells(EditUI.editor.graph.getModel().getCell(35), 0, null);
                                //EditUI.editor.graph.updateCellSize(EditUI.editor.graph.getSelectionCell(), false);
                            }
                        }
                    });

                    //insert connection links (arrows)
                    /*responseData.links.forEach(function(el){

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

                            /!*if (el.source === 'ae$78454'){
                                debugger;
                                console.log("el", el);
                                _this.editorUi.ne = newEdge;
                            }*!/

                            if (el.typeCode !== 'participant2step'){
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
                        }
                    });*/

                    targetsToDel.forEach(function(trg){
                       graph.getModel().remove(trg);
                    });
                }

                responseData.links.forEach(function(el){

                    if (el.typeCode !== 'participant2step'){
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

                            /*if (el.source === 'ae$78454'){
                             debugger;
                             console.log("el", el);
                             _this.editorUi.ne = newEdge;
                             }*/

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
                    }
                });

                if (parents.length > 0){
                    //arrange obj inside pools
                    parents.forEach(function(parentCell){
                        var childs = graph.getModel().getChildVertices(parentCell);
                        var newGroup = graph.groupCells(parentCell, 10, childs);
                        var layout = new mxHierarchicalLayout(graph, mxConstants.DIRECTION_WEST);
                        //var layout = new mxStackLayout(graph);
                        layout.border = 10;
                        layout.resizeParent = true;
                        layout.execute(newGroup);
                    });

                    //arrange pools vertical
                    var newGroup = graph.groupCells(graph.getDefaultParent(), 10, parents);
                    //var layout = new mxHierarchicalLayout(graph, mxConstants.DIRECTION_WEST);
                    var layout = new mxStackLayout(graph, false, 10);
                    layout.border = 10;
                    layout.resizeParent = true;

                    layout.execute(newGroup);

                    /*_this.editorUi.executeLayout(function()
                     {
                     var selectionCells = graph.getSelectionCells();
                     layout.execute(newGroup, selectionCells.length == 0 ? null : selectionCells);
                     }, true);*/

                    //arrange all horizontal
                    /*var cellsNoParent = graph.getModel().getChildVertices(graph.getDefaultParent());
                    newGroup = graph.groupCells(graph.getDefaultParent(), 10, cellsNoParent);
                    layout = new mxHierarchicalLayout(graph, mxConstants.DIRECTION_WEST);
                    //var layout = new mxStackLayout(graph);
                    layout.border = 10;
                    layout.resizeParent = true;
                    layout.execute(newGroup);*/

                    //_this.arrangeHorizontal();
                    //_this.arrangeOrganic();

                    //push arrow on first plan to see connections betwen pool and outer world
                    graph.setSelectionCells(graph.getModel().getChildEdges(graph.getDefaultParent()));
                    graph.orderCells(false);
                    graph.clearSelection();
                } else {
                    _this.arrangeHorizontal();
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
    //var baseParent = this.parent;
    //var parent;

    var width = '';
    var height = '';
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

        node.setAttribute('label', obj[attrToShow]);
        titleLength = obj[attrToShow].length;

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
    var widthHeight = this.getWidthHeight(titleLength);
    width = widthHeight.width;
    height = widthHeight.height;

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

    //set parent cell, there cell may not exists yet...(
    /*if (linkParents[obj['UUID']]){
        parent = linkParents[obj['UUID']];
    } else {
        parent = baseParent;
    }*/

    //if it's group = action, get cell from stencilsStore
    if (group === 'action'){
        var newStyle = editor.objectTypes.getElementStyle(metaClass, newValue);
        var protoCell = editor.stencilsStore.getById(newStyle);

        if (protoCell.cell){
            protoCell = protoCell.cell;

            var newProtoCell = graph.moveCells(protoCell, null, null, true, parent)[0];

            newProtoCell.setValue(node);
            newProtoCell.getGeometry().width = width;
            newProtoCell.getGeometry().height = height;
        }
    } else {
        graph.insertVertex(parent, null, node, globalUsersCellX, globalUsersCellY, width, height, style);
    }

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
