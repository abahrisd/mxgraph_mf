//get all vertices
EditUI.editor.graph.getModel().getDescendants(EditUI.editor.graph.getDefaultParent())

//get selected cells
EditUI.editor.graph.getSelectionCells()

//get selected cell
EditUI.editor.graph.getSelectionCell()

//get graph from EditorUI, EditUI is var in index
var graph = EditUI.editor.graph;

var model = EditUI.editor.graph.getModel();

//create document cell (construct from several items) while importing from JSON
cell = EditUI.sidebar.note;
newCell = graph.cloneCells([EditUI.sidebar.note]);
graph.addCell(newCell, graph.getDefaultParent());

//EditUI.editor.graph.addCell(EditUI.editor.graph.cloneCells([EditUI.sidebar.note]), EditUI.editor.graph.getDefaultParent());


//get style
EditUI.editor.graph.getStylesheet();

//set style
EditUI.editor.graph.getSelectionCells()[0].setStyle('step');EditUI.editor.graph.refresh();

//set complex style, when cell consists of several figures/cells
EditUI.editor.graph.addCell(EditUI.sidebar.graph.cloneCells(EditUI.sidebar.graph.getImportableCells(EditUI.sidebar.note))[0], EditUI.editor.graph.getDefaultParent());
//where EditUI.sidebar.note - saved complex cell, TODO create separate array for custom cells

//get style of selected cell
EditUI.editor.graph.getSelectionCells()[0].getStyle();

//example node
//For custom attributes we recommend using an XML node as the value of a cell.
//The following code can be used to create a cell with an XML node as the value
var doc = mxUtils.createXmlDocument();
var node = doc.createElement('MyNode');
node.setAttribute('label', 'MyLabel');

//set custom attribuute
node.setAttribute('attribute1', 'value1');

//signature of function insertVertex is
//insertVertex(parent, id, value,x, y, width, height, style, relative)

var newCell = graph.insertVertex(graph.getDefaultParent(), null, node, 40, 40, 80, 30);
console.log('newCell',newCell);

//var cell = new mxCell();
//graph.addCell(cell/*optional:, parent, index, source, target*/);


//step - зелёный прямоугольник

//event - конверт
//startEvent - круг
//intermediateEvent - двойной круг
//directionEvent - конверт
//endEvent - жирный круг

//parallelGateway - плюс в круге
//excludingGateway - крест в круге

//Бизнес-правило - розовая плашка - rule req$high
//Электронный формуляр - Data Object - документ ae$registry


//overright input

//overwright for change title attr on change label
/*var graphCellLabelChanged = graph.cellLabelChanged;
 graph.cellLabelChanged = function (cell, newValue, autoSize) {
 console.log("newval", newValue);
 if (cell.getValue().setAttribute) {
 var value = newValue;

 //workaround for FF, coz FF adding <br> at the end of label, i don't find where it happened
 //FIXME: Seek'n'destroy
 if (mxClient.IS_FF && newValue.substr(-4) === '<br>') {
 value = newValue.substr(0, newValue.length - 4);
 }

 var value = value.replace(/<(?:.|\n)*?>/gm, '');
 var value = value.replace(/\r?\n|\r/gm, '');
 cell.getValue().setAttribute('title', unescapeHTML(value));
 }

 graphCellLabelChanged.apply(this, arguments);
 };*/

// Overrides method to provide a cell label in the display
//FIXME fix label value after past formated text
/*graph.convertValueToString = function(cell) {
 var tmp = mxGraph.prototype.convertValueToString;

 if (mxUtils.isNode(cell.value) && cell.getAttribute('label', '') && cell.getAttribute('title', '')) {
 //return unescapeHTML(cell.getAttribute('label', '').replace(/<(?:.|\n)*?>/gm, ''));
 return cell.getAttribute('label', '').replace(/\r?\n|\r/gm, '');
 }

 return tmp.apply(this, arguments);
 //convertValueToString.apply(this, arguments);
 };*/

/*function unescapeHTML(escapedHTML) {
 //return decodeURIComponent(escapedHTML);
 return escapedHTML.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&nbsp;/g,' ')/!*.replace(/&amp;/g,'&')*!/;
 }

 function escapeHTML(unescapedHTML) {
 //return encodeURIComponent(unescapedHTML);
 return unescapedHTML.replace(/</g,'&lt;').replace(/>/g,'&gt;')/!*.replace(/&/g,'&amp;')*!/;
 }*/


//overwright to disable parsing html in label
//don't need it, coz remove html=1 from styles
/*graph.isHtmlLabel = function(cell){
 //var tmp = mxGraph.prototype.isHtmlLabel;
 return false;
 //tmp.apply(this, arguments);
 };

 mxGraph.prototype.isHtmlLabel = function(){
 return false;
 };*/


/*this.addEntry(this.getTagsForStencil('mxgraph.bpmn', 'user_task').join(' '), function()
 {
 var cell = new mxCell('', new mxGeometry(0, 0, 80, 80), 'shape=mxgraph.flowchart.on-page_reference;whiteSpace=wrap;fillColor=#ffffff;strokeColor=#000000;strokeWidth=2');
 cell.vertex = true;

 var cell1 = new mxCell('', new mxGeometry(0, 0, 50, 40), 'shape=message;whiteSpace=wrap;html=1;');
 cell1.vertex = true;
 cell1.geometry.relative = true;
 cell1.geometry.offset = new mxPoint(15, 20);
 cell.insert(cell1);

 //add custom attrs
 sb.addCustomAttrs(cell, 'ae$bpstep');

 sb.stencilsStore.start_event_msg = sb.graph.cloneCells([cell]);
 return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Начальное событие с сообщением');
 }),*/
/*this.addEntry(this.getTagsForStencil('mxgraph.bpmn', 'user_task').join(' '), function()
 {
 var cell = new mxCell('', new mxGeometry(0, 0, 80, 80), 'shape=mxgraph.flowchart.on-page_reference;whiteSpace=wrap;fillColor=#ffffff;strokeColor=#000000;strokeWidth=9');
 cell.vertex = true;

 var cell1 = new mxCell('', new mxGeometry(0, 0, 50, 40), 'shape=message;whiteSpace=wrap;fillColor=#000000;strokeColor=#ffffff;strokeWidth=2;');
 cell1.vertex = true;
 cell1.geometry.relative = true;
 cell1.geometry.offset = new mxPoint(15, 20);
 cell.insert(cell1);

 //add custom attrs
 sb.addCustomAttrs(cell, 'ae$bpstep');

 sb.stencilsStore.end_event_msg = sb.graph.cloneCells([cell]);
 return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Конечное событие с сообщением');
 }),*/
/*this.addEntry(this.getTagsForStencil('mxgraph.bpmn', 'user_task').join(' '), function()
 {
 var cell = new mxCell('', new mxGeometry(0, 0, 80, 80), 'ellipse;shape=doubleEllipse;whiteSpace=wrap;');
 cell.vertex = true;

 var cell1 = new mxCell('', new mxGeometry(0, 0, 50, 40), 'shape=message;whiteSpace=wrap;');
 cell1.vertex = true;
 cell1.geometry.relative = true;
 cell1.geometry.offset = new mxPoint(15, 20);
 cell.insert(cell1);

 //add custom attrs
 sb.addCustomAttrs(cell, 'ae$bpstep');

 sb.stencilsStore.mid_event_msg_receive = sb.graph.cloneCells([cell]);
 return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Промежуточное событие с сообщением (получение)');
 }),
 this.addEntry(this.getTagsForStencil('mxgraph.bpmn', 'user_task').join(' '), function()
 {
 var cell = new mxCell('', new mxGeometry(0, 0, 80, 80), 'ellipse;shape=doubleEllipse;whiteSpace=wrap;');
 cell.vertex = true;

 var cell1 = new mxCell('', new mxGeometry(0, 0, 50, 40), 'shape=message;whiteSpace=wrap;fillColor=#000000;strokeColor=#ffffff;strokeWidth=2;');
 cell1.vertex = true;
 cell1.geometry.relative = true;
 cell1.geometry.offset = new mxPoint(15, 20);
 cell.insert(cell1);

 //add custom attrs
 sb.addCustomAttrs(cell, 'ae$bpstep');

 sb.stencilsStore.mid_event_msg_receive = sb.graph.cloneCells([cell]);
 return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Промежуточное событие с сообщением (отправление)');
 }),*/