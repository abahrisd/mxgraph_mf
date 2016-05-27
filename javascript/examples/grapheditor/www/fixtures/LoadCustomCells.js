var graph = EditUI.editor.graph;

//FIXME: for test purposes only! Don't use it in production!!!1111oneoneone
//TODO Create separate class for all this stuf
//global vars, should be property of SetUserCell instance
var globalUsersCellX = 40;
var globalUsersCellY = 40;
var parent = graph.getDefaultParent();

//get child vertices
//graph.getChildVertices(graph.getDefaultParent())
//EditUI.editor.graph.getChildVertices(EditUI.editor.graph.getDefaultParent())

//get all cells
//mxGraphModel.getChildCells(graph.getModel(), graph.getDefaultParent(), true, true).
//EditUI.editor.graph.getModel().getDescendants(EditUI.editor.graph.getDefaultParent())

//get attribute
//graph.getChildVertices(graph.getDefaultParent())[0].getValue().getAttribute('UUID')


/*
graph.getModel().addListener(mxEvent.CHANGE, new mxIEventListener(){
    public void invoke(Object sender, mxEventObject evt){
        //Object changes = evt.getProperties().get("changes");
        if (changes instanceof ArrayList){
            ArrayList list = (ArrayList) changes;
            for (Object o : list){
                if (o instanceof mxGeometryChange){
                    Object value = ((mxCell) ((mxGeometryChange) o).getCell()).getValue();
                    System.out.println(value);
                }}
        }
    }
});
*/

/**
 * Find cells with same UUID as in provided cell
 * cell - provided cell
 * return Array of cells
 */
function findCellsWithSameUUID(cell){
    var cells = [];
    var UUID = cell.getValue().getAttribute('UUID');
    var cellId = cell.getId();

    //TODO add graph var or find out how to get root graph globaly
    graph.getModel().getDescendants(graph.getDefaultParent()).forEach(function(el){
        if (el.getValue() && el.getValue().getAttribute('UUID') && el.getValue().getAttribute('UUID') === UUID && cellId != el.getId()){
            cells.push(el)
        }
    });

    return cells;
}


/**
 * Set attributes from cell equal to all cells in cellsSameUUID
 * cell - source cell
 * cellsToUpdate - array of cells to make attributes equal sourse cell
 * return boolean
 */
function setAttributesEqual(cell, cellsToUpdate){

    graph.getModel().beginUpdate();
    try
    {
        cellsToUpdate.forEach(function(el){

            for (var i = 0, atts = cell.getValue().attributes, n = atts.length; i < n; i++){
                el.getValue().setAttribute(atts[i].nodeName, atts[i].nodeValue);
            }
        });

    }
    finally
    {
        graph.getModel().endUpdate();
    }
}


//listen chenges in model
graph.getModel().addListener(mxEvent.CHANGE, function(sender, evt){
    var changes = evt.getProperty('edit').changes;

    changes.forEach(function(el){

        //if changes in vertex with UUID
        if (el.cell && el.cell.isVertex() && el.cell.getValue() && el.cell.getValue().getAttribute('UUID')){
            var cell = el.cell;

            //check is exists dublicates elements with same UUID
            var cellsSameUUID = findCellsWithSameUUID(cell);

            if (cellsSameUUID.length > 0) {
                setAttributesEqual(cell, cellsSameUUID)
            }

        }
    });
});

function getCellsFromFile(url){

    //no jquery, only hardcore, mb slapy, mb change in future
    var client = new XMLHttpRequest();
    client.open('GET', url);

    client.onreadystatechange = function() {

        if (client.readyState == 4 && client.status == 200) {
            if (client.responseText){
                try{
                    console.log('client.responseText', client.responseText);
                    var responseData = JSON.parse(client.responseText);

                    responseData.forEach(function(el){
                        createCellFromUserObject(el);
                    })
//                            console.log('responseData', responseData);

//                            return responseData;
                } catch (e){
                    console.log('Error while parsing JSON ',e.stack);
                }
            }
        }
        //console.log('response', client.responseText);
    }

    client.send();
}

function createCellFromUserObject(obj){
//            console.log(obj);

    var doc = mxUtils.createXmlDocument();
    var node = doc.createElement('UserNode');

    //set title
    node.setAttribute('label', obj.title?obj.title:'UserLable');

    //set attributes, except title
    for (var key in obj) {
        //don't care about obj.hasOwnProperty(key) con obj created from json
        if (key === 'title') {
            continue;
        }
        node.setAttribute(key, obj[key]);
    }

    //var newCell =
    //place new cell
    parent = graph.insertVertex(parent, null, node, globalUsersCellX, globalUsersCellY, 80, 30);
    //globalUsersCellX += 40;
    //globalUsersCellY += 40;
}

getCellsFromFile('fixtures/testdata.json');