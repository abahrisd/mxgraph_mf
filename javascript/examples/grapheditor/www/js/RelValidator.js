/**
 * Load and sve type links
 */
function RelValidator(editorUi)
{
    this.editorUi = editorUi;
    this.graph = this.editorUi.editor.graph;

    //object for storing link types
    //this._linkTypes = [];
    this._linkTypes = editorUi.linkTypes;


    this.init();
};

/**
 * Init seting privilege
 */
RelValidator.prototype.init = function() {

    this.addEdgeValidation();

    mxUtils.alert = function(msg){
        /*var div = document.createElement('div');
        div.textContent = text;
        alert(msg);*/
        this.error(msg, 300, true);
    };
    //this._linkTypes = this.editorUi.linkTypes;
    //this._linkTypes = this.loadLinkTypes(url);
    //this.createValidateListener();

};

/**
 * Init seting privilege
 */
RelValidator.prototype.addEdgeValidation = function() {

    var _this = this;
    //mxConstants.INVALID_CONNECT_TARGET_COLOR = '#FFF000';

    /*mxEdgeHandler.prototype.isConnectableCell = function(cell){
        return true;
    };*/

    //overwright edge validator
    this.editorUi.editor.graph.getEdgeValidationError = function(edge, source, target){

        if (edge != null && this.model.getValue(edge) != null){

            /**
             * Мы знаем источник и приёмник у этой грани
             * Мы смотрим в справочник связей, если есть связь с таким источником, приёмником и стилем то разрешаем, если такой связи нет - то запрещаем.
             * EZ.* Поехали!
             * */

            if (_this._linkTypes && edge.getValue() && edge.getValue().getAttribute('metaClass')){

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

                var linkTypes = _this._linkTypes.getAll();

                //TODO Refactor this block about errors
                var error = false;

                //смотрим forbiddenConnections, если нашли наш случай - то выбрасываем ошибк
                //если не нашли ограничений, смотрим разрешения
                //если не нашлиразрешения - то выбрасываем ошибку
                if (edge && (source || target)){
                    error = _this.checkForbiddenConnections(edge, source, target);
                }

                if (error){
                    if (DEBUG){
                        console.log(mxResources.get('errorForbiddenConnection'));
                    }
                    return mxResources.get('errorForbiddenConnection')
                }

                error = true;
                for (var i in linkTypes){
                    if (i){
                        if ( (sourceCode === undefined || (linkTypes[i].sourceType && linkTypes[i].sourceType === sourceCode)) &&
                            (targetCode === undefined || (linkTypes[i].targetType && linkTypes[i].targetType === targetCode)) &&
                                //TODO refactor ifelse
                            ((sourceCode === undefined && targetCode === undefined ) || (linkTypes[i].connectionType && linkTypes[i].connectionType === edgeCode))
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
                    //mxConstants.HIGHLIGHT_COLOR = '#ff0000';
                    //mxConstants.CONNECT_TARGET_COLOR = '#ff0000';
                    //var graph = _this.graph;
                    //var highlight = new mxCellHighlight(graph, '#ff0000', 2);
                    //highlight.highlight(graph.view.getState(target));

                    if (DEBUG){
                        console.log(mxResources.get('errorBound'));
                    }
                    return mxResources.get('errorBound')
                }
            }
        }

        return mxGraph.prototype.getEdgeValidationError.apply(this, arguments);
    };

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
        console.log("src", src);
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
};

/**
 * checkForbiddenConnections
 */
RelValidator.prototype.checkForbiddenConnections = function(edge, source, target) {

    var ui = this.editorUi;
    var objectTypes = ui.objectTypes;
    var forbiddenConnections = ui.forbiddenConnections;
    var error = false;

    forbiddenConnections.some(function(el){
        if (el.restrictionType === 'byTemplates'){

            if ((!el.sourceTemplate && !el.targetTemplate) || !el.connectionType){
                return false;
            }

            if (el.connectionType === edge.getValue().getAttribute('metaClass')){

                //запрещаются любые входящие связи connectionType для шаблонов targetTemplate
                if (el.sourceTemplate === null && el.targetTemplate === objectTypes.getCellTmp(target) ){
                    error = true;
                    return true;

                //запрещаются любые исходящие связи connectionType на шаблоны sourceTemplate
                } else if (el.targetTemplate === null && el.sourceTemplate === objectTypes.getCellTmp(source) ){
                    error = true;
                    return true;
                } else if ( el.targetTemplate === objectTypes.getCellTmp(target) && el.sourceTemplate === objectTypes.getCellTmp(source) ) {
                    error = true;
                    return true;
                }
            }
        }
        return false;
    });

    return error;
};

