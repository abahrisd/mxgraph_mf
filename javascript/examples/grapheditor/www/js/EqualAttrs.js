/**
 * Listen changes of cells, and make equal attributes in cells with same paramName
 */
function EqualAttrs(editorUi, paramName)
{
    this.editorUi = editorUi;
    this.graph = this.editorUi.editor.graph;
    this.paramName = paramName;
    this.refreshGraph = false;

    this.globalUsersCellX = 40;
    this.globalUsersCellY = 40;
    this.parent = this.graph.getDefaultParent();

    this.init();
};

/**
 * Show that lable is changed and we need to refresh graph
 */
//EqualAttrs.prototype.refreshGraph = false;
/**
 * Init listen changes
 */
EqualAttrs.prototype.init = function() {
    var graph = this.graph;
    var _this = this;

    graph.getModel().addListener(mxEvent.CHANGE, function(sender, evt){
        var changes = evt.getProperty('edit').changes;

        //param to search equal elements
        var param = _this.paramName;

        changes.forEach(function(el){

            //if changes in vertex with UUID
            if (el.cell && el.cell.isVertex() && el.cell.getValue() && el.cell.getValue().getAttribute && el.cell.getValue().getAttribute(param)){
                var cell = el.cell;

                //check is exists dublicates elements with same UUID
                var cellsSameUUID = _this.findEqualCells(cell, param);

                //copy attrs from cell to each cellsSameUUID
                if (cellsSameUUID.length > 0) {
                    _this.setAttributesEqual(cell, cellsSameUUID)
                }
            }
        });

        if (_this.refreshGraph){
            graph.refresh();
            _this.refreshGraph = false;
        }
    });
};

/**
 * Find cells with same paramName as in provided cell
 * cell - provided cell
 * return Array of cells
 */
EqualAttrs.prototype.findEqualCells = function(cell, paramName) {
    var cells = [];
    var graph = this.graph;
    var UUID = cell.getValue().getAttribute(paramName);
    var cellId = cell.getId();

    graph.getModel().getDescendants(graph.getDefaultParent()).forEach(function(el){
        if (el.getValue() && el.getValue().getAttribute && el.getValue().getAttribute(paramName) && el.getValue().getAttribute(paramName) === UUID && cellId != el.getId()){
            cells.push(el)
        }
    });

    return cells;
};

/**
 * Set attributes from cell equal to all cells in cellsSameUUID
 * cell - source cell
 * cellsToUpdate - array of cells to make attributes equal sourse cell
 * return boolean
 */
EqualAttrs.prototype.setAttributesEqual = function(cell, cellsToUpdate){

    var graph = this.graph;
    var _this = this;
    graph.getModel().beginUpdate();
    var attrToShow = '';


    //TODO refactor it. Need event for change label
    var atributesDirectory = this.editorUi.atributesDirectory;
    if (atributesDirectory) {
        var metaClass = cell.getValue().getAttribute('metaClass');

        if (atributesDirectory.getById(metaClass)){
            var attributeItem = atributesDirectory.getById(metaClass);
            if (attributeItem.nameAttribute){
                attrToShow = attributeItem.nameAttribute;
            }
        }
    }

    try {
        cellsToUpdate.forEach(function(el){
            for (var i = 0, atts = cell.getValue().attributes, n = atts.length; i < n; i++){

                var attrValue = el.getValue().getAttribute(atts[i].nodeName);
                if (attrValue !== atts[i].nodeValue){
                    el.getValue().setAttribute(atts[i].nodeName, atts[i].nodeValue);
                    if (atts[i].nodeName === attrToShow){
                        el.getValue().setAttribute('label', atts[i].nodeValue);
                        _this.refreshGraph = true;
                    }
                }
            }
        });
    } finally {
        graph.getModel().endUpdate();
    }
}



/**
 * Load cells from provided url
 * url - string
 * return void
 */
EqualAttrs.prototype.getCellsByURL = function(url){

    var _this = this;

    var onload = function(req){
        try{
            var responseData = JSON.parse(req.getText());

            if (responseData !== undefined){
                responseData.forEach(function(el){
                    _this.createCellFromUserObject(el);
                })
            }

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

};