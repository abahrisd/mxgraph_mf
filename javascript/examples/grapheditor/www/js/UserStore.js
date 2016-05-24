/**
 * Load and store attributes values, for further objects/panels construction
 */
function UserStore(url, data, idValue)
{
    //this.editorUi = editorUi;
    //this.graph = this.editorUi.editor.graph;

    //object for storing link types
    //this.__linkTypes = [];

    //overwright edge validator
    this._items = {};
    this.idValue = idValue;
    this.init(url, data);
};


/**
 * Init setting privilege
 */
UserStore.prototype.init = function(url, data) {
    var _this = this;

    if (url){
        this.loadData(url);
    } else if (data){
        data.forEach(function(el){
            _this._add(el)
        });
        //this.setData(data);
    }

    //this.createValidateListener();

};

/**
 * Synchronously load file from server and add it to store
 */
UserStore.prototype.loadData = function(url){

    var _this = this;
    try{
        var req = mxUtils.load(url);
        var responseData = JSON.parse(req.getText());

        if (responseData){
            responseData.forEach(function(el){
                _this._add(el)
            });
        }

    } catch (e){
        console.log('Error on load store',e.stack);
    }
};

/**
 * Add attribute object in store
 */
UserStore.prototype._add = function(item) {
    this._items[item[this.idValue]] = item;
};

/**
 * Add attribute object in store
 */
UserStore.prototype.getById = function(id) {
    return this._items[id]
};

/**
 * Return all items
 */
UserStore.prototype.getAll = function() {
    return this._items
};
