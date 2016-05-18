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