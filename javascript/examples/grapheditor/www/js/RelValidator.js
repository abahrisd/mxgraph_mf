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
    editorUi.editor.graph.getEdgeValidationError = function(edge, source, target){

        if (edge != null && this.model.getValue(edge) != null){

            /**
             * Мы знаем источник и приёмник у этой грани
             * Мы смотрим в справочник связей, если есть связь с таким источником, приёмником и стилем то разрешаем, если такой связи нет - то запрещаем.
             * EZ.
             * Поехали!
             *
             * */

            if (editorUi.linkTypes && edge.getValue() && edge.getValue().getAttribute('metaClass')){

                //metaClass for edges is solidLine and dashedLine
                var edgeCode = edge.getValue().getAttribute('metaClass');
                var sourceCode;
                var targetCode;

                if (source != null && this.model.getValue(source) != null){
                    sourceCode = source.getValue().getAttribute('metaClass');
                }

                if (target != null && this.model.getValue(target) != null){
                    targetCode = target.getValue().getAttribute('metaClass');
                }

                var linkTypes = editorUi.linkTypes.getAll();
                var error = true;

                for (var i in linkTypes){
                    if (i){
                        /*if (i == 'rule2step'){
                            console.log("linkTypes[i].sourceType", linkTypes[i].sourceType);
                            console.log("sourceCode", sourceCode);
                            console.log("linkTypes[i].targetType", linkTypes[i].targetType);
                            console.log("targetCode", targetCode);
                            console.log("edgeCode", edgeCode);
                            console.log("linkTypes[i].style", linkTypes[i].style);
                        }*/
                        if ( (sourceCode === undefined || (linkTypes[i].sourceType && linkTypes[i].sourceType === sourceCode)) &&
                            (targetCode === undefined || (linkTypes[i].targetType && linkTypes[i].targetType === targetCode)) &&
                            linkTypes[i].style && linkTypes[i].style === edgeCode
                        ){
                            error = false;
                            if (sourceCode && targetCode) {
                                edge.setAttribute('typeCode', i);
                                edge.setAttribute('source', sourceCode);
                                edge.setAttribute('target', targetCode);
                            }
                        }
                    }
                }

                if (error){
                    return mxResources.get('errorBound');
                }
            }

            /*if (source != null && this.model.getValue(source) != null && source.getValue().getAttribute('_metaClass') != edge.getValue().getAttribute('sourceType')){
                return mxResources.get('errorBoundSource');
            }

            if (target != null && this.model.getValue(target) != null && target.getValue().getAttribute('_metaClass') != edge.getValue().getAttribute('targetType')){
                return mxResources.get('errorBoundTarget');
            }*/
        }

        return mxGraph.prototype.getEdgeValidationError.apply(this, arguments);
    };

    this.init(linksUrl);
};

/**
 * Init seting privilege
 */
RelValidator.prototype.init = function(url) {

    this.__linkTypes = this.editorUi.linkTypes;
    //this.__linkTypes = this.loadLinkTypes(url);
    //this.createValidateListener();

};

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

