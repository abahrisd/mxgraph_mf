/**
 * Load and sve type links
 */
function RelValidator(editorUi, linksUrl)
{
    this.editorUi = editorUi;
    this.graph = this.editorUi.editor.graph;

    //object for storing link types
    this.__linkTypes = [];

    //overwright edge validator
    EditUI.editor.graph.getEdgeValidationError = function(edge, source, target){

        if (edge != null && this.model.getValue(edge) != null){

            if (source != null && this.model.getValue(source) != null && source.getValue().getAttribute('_metaClass') != edge.getValue().getAttribute('sourceType')){
                return mxResources.get('errorBoundSource');
            }

            if (target != null && this.model.getValue(target) != null && target.getValue().getAttribute('_metaClass') != edge.getValue().getAttribute('targetType')){
                return mxResources.get('errorBoundTarget');
            }
        }

        return mxGraph.prototype.getEdgeValidationError.apply(this, arguments);
    };

    this.init(linksUrl);
};

/**
 * Init seting privilege
 */
RelValidator.prototype.init = function(url) {

    this.__linkTypes = this.loadLinkTypes(url);
    //this.createValidateListener();

};


/**
 * Init seting privilege
 */
RelValidator.prototype.loadLinkTypes = function(url) {

    var onload = function(req){
        try{

            return JSON.parse(req.getText());

        } catch (e){
            console.log('Error while loading linkTypes ',e.stack);
        }
    };

    var onerror = function(req){
        mxUtils.alert('Error while loading linkTypes from server');
    };

    new mxXmlRequest(url, 'key=value').send(onload, onerror);
}


/**
 * Init seting privilege
 */
RelValidator.prototype.createValidateListener = function() {

    var graph = this.graph;
    var ui = this.editorUi;
    graph.addListener(mxEvent.CONNECT_CELL, function(sender, evt){
    //graph.addListener(mxEvent.CELL_CONNECTED, function(sender, evt){

        var model = graph.getModel();
        var edge = evt.getProperty('edge');
        var src = model.getTerminal(edge, true);
        var trg = model.getTerminal(edge, false);

        //check for allowing connection
        if ((src === null || src.getValue().getAttribute('code') === edge.getValue().getAttribute('sourceType')) &&
            (trg === null || trg.getValue().getAttribute('code') === edge.getValue().getAttribute('targetType'))
        ) {
            console.log("allowed");
        } else {
            console.log("not allowed");
            //return;
            //ui.undo();
        }
    });
}

