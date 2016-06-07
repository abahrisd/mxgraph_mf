/**
 * Store for stencils, to keep width, height and style.
 * MB we should create base store class, and extend this one from it?\ Ahh, in future)
 */
function Stencils() {

    //this.editorUi = editorUi;
    //this.graph = this.editorUi.editor.graph;

    //object for storing link types
    //this.__linkTypes = [];

    //this.origin = window.location.origin;
    //this.getPath = window.location.getPath;

    //overwright edge validator
    this._items = {};
    this.idValue = 'code';
    this.init();
};

/**
 * Base width for stancils without style
 */
Stencils.prototype.baseWidth = 160;

/**
 * Base height for stancils without style
 */
Stencils.prototype.baseHeight = 100;

/**
 * Init store
 */
Stencils.prototype.init = function () {
    var _this = this;

    //TODO create locak stylesheet and load it on start, need unified class names
    var stencilsObject = [
        {
            code: 'participant',
            style: 'pool',
            //style: 'shape=swimlane;swimlaneFillColor=white;horizontal=0;startSize=20;',
            width: 370,
            height: 240,
            metaClass: 'ae$participant'
        }, {
            code: 'swimlane',
            style: 'swimlane',
            //style: 'shape=swimlane;horizontal=0;swimlaneFillColor=white;swimlaneLine=0;',
            width: 300,
            height: 120,
            metaClass: 'swinline'
        }, {
            code: 'startEvent',
            style: 'startEvent',
            //style: 'shape=mxgraph.flowchart.on-page_reference;whiteSpace=wrap;fillColor=#ffffff;strokeColor=#000000;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;',
            width: 50,
            height: 50,
            metaClass: 'ae$bpstep'
        }, {
            code: 'startEventWithMessage',
            style: 'startEventWithMessage',
            //style: 'shape=mxgraph.bpmn.event_start_msg;whiteSpace=wrap;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;',
            width: 50,
            height: 50,
            metaClass: 'ae$bpstep'
        }, {
            code: 'endEvent',
            style: 'endEvent',
            //style: 'shape=mxgraph.flowchart.on-page_reference;whiteSpace=wrap;fillColor=#ffffff;strokeColor=#000000;strokeWidth=5;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;',
            width: 50,
            height: 50,
            metaClass: 'ae$bpstep'
        }, {
            code: 'endEventWithMessage',
            style: 'endEventWithMessage',
            //style: 'shape=mxgraph.bpmn.event_end_msg;whiteSpace=wrap;fillColor=#000000;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;',
            width: 50,
            height: 50,
            metaClass: 'ae$bpstep'
        }, {
            code: 'intermediateEvent',
            style: 'intermediateEvent',
            //style: 'shape=doubleEllipse;whiteSpace=wrap;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;',
            width: 50,
            height: 50,
            metaClass: 'ae$bpstep'
        }, {
            code: 'intermediateEventWithMessageThrow',
            style: 'intermediateEventWithMessageThrow',
            //style: 'shape=mxgraph.bpmn.event_mailfill;whiteSpace=wrap;fillColor=#000000;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;',
            width: 50,
            height: 50,
            metaClass: 'ae$bpstep'
        }, {
            code: 'intermediateEventWithMessageCatch',
            style: 'intermediateEventWithMessageCatch',
            //style: 'shape=mxgraph.bpmn.event_mail;whiteSpace=wrap;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;',
            width: 50,
            height: 50,
            metaClass: 'ae$bpstep'
        }, {
            code: 'intermediateEventWithTimer',
            style: 'intermediateEventWithTimer',
            //style: 'shape=mxgraph.bpmn.event_timer;whiteSpace=wrap;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;',
            width: 50,
            height: 50,
            metaClass: 'ae$bpstep'
        }, {
            code: 'intermediateEventWithLinkCatch',
            style: 'intermediateEventWithLinkCatch',
            //style: 'shape=mxgraph.bpmn.event_arrow;whiteSpace=wrap;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;',
            width: 50,
            height: 50,
            metaClass: 'ae$bpstep'
        }, {
			code: 'intermediateEventWithLinkThrow',
            style: 'intermediateEventWithLinkThrow',
            //style: 'shape=mxgraph.bpmn.event_arrow_fill;whiteSpace=wrap;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;',
            width: 50,
            height: 50,
            metaClass: 'ae$bpstep'
        }, {
            code: 'excludingGateway',
            style: 'excludingGateway',
            //style: 'shape=gatewayExclude;whiteSpace=wrap;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;',
            width: 50,
            height: 50,
            metaClass: 'ae$bpstep'
        }, {
            code: 'parallelGateway',
            style: 'parallelGateway',
            //style: 'shape=gatewayParallel;whiteSpace=wrap;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;',
            width: 50,
            height: 50,
            metaClass: 'ae$bpstep'
        }, {
            code: 'registry',
            style: 'dataObject',
            //style: 'dataObject;',
            //style: 'shape=card;whiteSpace=wrap;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;size=16;',
            width: 50,
            height: 70,
            metaClass: 'ae$registry'
        }, {
            code: 'document',
            style: 'document',
            //style: 'dataObject;strokeColor=#CCCC00;whiteSpace=wrap;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;',
            width: 50,
            height: 70,
            metaClass: 'nd$nd'
        }, {
            code: 'rule',
            style: 'rule',
            //style: 'shape=mxgraph.flowchart.document;whiteSpace=wrap;fillColor=#FFCCE6;strokeColor=#000000;strokeWidth=2',
            width: 105,
            height: 36,
            metaClass: 'req$high'
        }, {
            code: 'solidLine',
            style: 'solidLine',
            //style: 'endArrow=classic;whiteSpace=wrap;edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;jettySize=auto;orthogonalLoop=1;',
            width: 50,
            height: 50,
            metaClass: "controlFlow"
        }, {
            code: 'dashedLine',
            style: 'dashedLine',
            //style: 'endArrow=classic;dashed=1;dashPattern=8 8;whiteSpace=wrap;edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;jettySize=auto;orthogonalLoop=1;',
            width: 50,
            height: 50,
            metaClass: "messageFlow"
        }, {
            code: 'dottedLine',
            style: 'dottedLine',
            //style: 'endArrow=classic;dashed=1;dashPattern=1 4;strokeWidth=2;whiteSpace=wrap;edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;jettySize=auto;orthogonalLoop=1;',
            width: 50,
            height: 50,
            metaClass: "associationFlow"
        }, {
            code: 'text',
            style: 'text',
            //style: 'text;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;overflow=hidden;',
            width: 50,
            height: 50,
            metaClass: null
        }
    ];

    stencilsObject.forEach(function(el){
        _this._add(el);
    });
    //stencilsObject.forEach(_this._add);

};


/**
 * Init store
 */
Stencils.prototype._add = function (item) {
    this._items[item[this.idValue]] = item;
}

/**
 * Init store
 */
Stencils.prototype.getAll = function () {
    return this._items;
}

/**
 * Init store
 */
Stencils.prototype.getById = function (id) {
    return this._items[id];
}


/**
 * get first item with given metaClass
 */
Stencils.prototype.getByMetaClass = function (metaClass) {

    for (var i in this._items){
        if (this._items.hasOwnProperty(i)){
            if (this._items[i].metaClass === metaClass){
                return this._items[i];
            }
        }
    }
};

/**
 * Init store
 */
Stencils.prototype.getWidth = function (id) {
    if (this._items[id]){
        return this._items[id].width
    }
    return this.baseWidth;
}

/**
 * Init store
 */
Stencils.prototype.getHeight = function (id) {
    if (this._items[id]){
        return this._items[id].height
    }
    return this.baseHeight;
}

/**
 * Init store
 */
Stencils.prototype.getStyle = function (id) {
    if (this._items[id]){
        return this._items[id].style
    }
    return 'whiteSpace=wrap;';
}

/**
 * Init store
 */
Stencils.prototype.getMetaClass = function (id) {
    if (this._items[id]){
        return this._items[id].metaClass;
    }
    return '';
}
