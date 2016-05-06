//get graph from EditorUI, EditUI is var in index
var graph = EditUI.editor.graph;

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