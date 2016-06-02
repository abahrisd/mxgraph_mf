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
 * Init store
 */
Stencils.prototype.init = function () {
    var _this = this;

    //TODO create locak stylesheet and load it on start, need unified class names
    var stencilsObject = [
        {
            code: 'participant',
            style: 'shape=swimlane;swimlaneFillColor=white;horizontal=0;startSize=20;',
            width: 320,
            height: 240,
            metaClass: 'ae$participant'
        }, {
            code: 'swimlane',
            style: 'shape=swimlane;horizontal=0;swimlaneFillColor=white;swimlaneLine=0;',
            width: 300,
            height: 120,
            metaClass: 'swinline'
        }, {
            code: 'startEvent',
            style: 'shape=mxgraph.flowchart.on-page_reference;whiteSpace=wrap;fillColor=#ffffff;strokeColor=#000000;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;',
            width: 80,
            height: 80,
            metaClass: 'ae$bpstep'
        }, {
            code: 'startEventWithMessage',
            style: 'shape=mxgraph.bpmn.event_start_msg;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;',
            width: 80,
            height: 80,
            metaClass: 'ae$bpstep'
        }, {
            code: 'endEvent',
            style: 'shape=mxgraph.flowchart.on-page_reference;whiteSpace=wrap;fillColor=#ffffff;strokeColor=#000000;strokeWidth=9;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;',
            width: 80,
            height: 80,
            metaClass: 'ae$bpstep'
        }, {
            code: 'endEventWithMessage',
            style: 'shape=mxgraph.bpmn.event_end_msg;fillColor=#000000;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;',
            width: 80,
            height: 80,
            metaClass: 'ae$bpstep'
        }, {
            code: 'intermediateEvent',
            style: 'shape=doubleEllipse;whiteSpace=wrap;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;',
            width: 80,
            height: 80,
            metaClass: 'ae$bpstep'
        }, {
            code: 'intermediateEventWithMessageThrow',
            style: 'shape=mxgraph.bpmn.event_mailfill;fillColor=#000000;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;',
            width: 80,
            height: 80,
            metaClass: 'ae$bpstep'
        }, {
            code: 'intermediateEventWithMessageCatch',
            style: 'shape=mxgraph.bpmn.event_mail;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;',
            width: 80,
            height: 80,
            metaClass: 'ae$bpstep'
        }, {
            code: 'intermediateEventWithTimer',
            style: 'shape=mxgraph.bpmn.event_timer;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;',
            width: 80,
            height: 80,
            metaClass: 'ae$bpstep'
        }, {
            code: 'intermediateLink1Event',
            style: 'shape=mxgraph.bpmn.event_arrow;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;',
            width: 80,
            height: 80,
            metaClass: 'ae$bpstep'
        }, {
            code: 'intermediateLink2Event',
            style: 'shape=mxgraph.bpmn.event_arrow_fill;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;',
            width: 80,
            height: 80,
            metaClass: 'ae$bpstep'
        }, {
            code: 'excludingGateway',
            style: 'shape=gatewayExclude;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;',
            width: 50,
            height: 50,
            metaClass: 'ae$bpstep'
        }, {
            code: 'parallelGateway',
            style: 'shape=gatewayParallel;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;',
            width: 50,
            height: 50,
            metaClass: 'ae$bpstep'
        }, {
            code: 'registry',
            style: 'shape=card;whiteSpace=wrap;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;',
            width: 50,
            height: 70,
            metaClass: 'ae$registry'
        }, {
            code: 'document',
            style: 'dataObject;strokeColor=#CCCC00;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;',
            width: 80,
            height: 100,
            metaClass: 'nd&nd'
        }, {
            code: 'rule',
            style: 'shape=mxgraph.flowchart.document;whiteSpace=wrap;fillColor=#FFCCE6;strokeColor=#000000;strokeWidth=2',
            width: 105,
            height: 36,
            metaClass: 'req$high'
        }, {
            code: 'solidLine',
            style: 'endArrow=classic;',
            width: 50,
            height: 50,
            metaClass: "controlFlow"
        }, {
            code: 'dashedLine',
            style: 'endArrow=classic;dashed=1;dashPattern=8 8;',
            width: 50,
            height: 50,
            metaClass: "messageFlow"
        }, {
            code: 'dottedLine',
            style: 'endArrow=classic;dashed=1;dashPattern=1 4;strokeWidth=2;',
            width: 50,
            height: 50,
            metaClass: "associationFlow"
        }, {
            code: 'text',
            style: 'text;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;overflow=hidden;',
            width: 50,
            height: 50,
            metaClass: null
        }
    ];

    stencilsObject.forEach(function(el){
        _this._add(el)
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
 * Init store
 */
Stencils.prototype.getWidth = function (id) {
    if (this._items[id]){
        return this._items[id].width
    }
    return 0;
}

/**
 * Init store
 */
Stencils.prototype.getHeight = function (id) {
    if (this._items[id]){
        return this._items[id].height
    }
    return 0;
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
