/**
 * Load and store attributes values, for further objects/panels construction
 */
function UserStore(url)
{
    //this.editorUi = editorUi;
    //this.graph = this.editorUi.editor.graph;

    //object for storing link types
    //this.__linkTypes = [];

    //overwright edge validator
    this._items = {};
    this.init(url);
};


/**
 * Init seting privilege
 */
UserStore.prototype.init = function(url) {
    this.loadData(url);
    //this.createValidateListener();

};

/**
 * Load stylesheet.xml from server and set it to graph
 */
UserStore.prototype.loadData = function(url){

    var _this = this;
    var req = mxUtils.load(url);

    try{

        var responseData = JSON.parse(req.getText());

        if (responseData){
            responseData.forEach(function(el){
                _this._add(el)
            });
        }

    } catch (e){
        console.log('Error while parsing JSON ',e.stack);
    }

    /*for (var i in responseData){

        console.log("i", i);
        //var tmp_obj = {};
        //tmp_obj[i] = responseData;
        //_this._items.push({i:responseData[i]})
    }*/
    //var resp = req.getText();
    //var root = req.getDocumentElement();
    //var dec = new mxCodec(root.ownerDocument);
    //console.log("attrs", responseData);
    //console.log("this._items", _this._items);

    //var nodstyle = dec.decode(root, _this.graph.stylesheet);

}

/**
 * Add attribute object in store
 */
UserStore.prototype._add = function(item) {
    this._items[item.$id] = item;
};

/**
 * Add attribute object in store
 */
UserStore.prototype.getById = function($id) {
    return this._items[$id]
};
