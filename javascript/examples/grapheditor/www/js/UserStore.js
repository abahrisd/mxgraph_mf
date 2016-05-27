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

/**
 * Return templates fom store, which exists in stencils object
 */
UserStore.prototype.getTemplatesByStencils = function(stencils) {

    var res = [];
    var objectTypesItems = this.getAll();

    for (var i in objectTypesItems){
        var templates = objectTypesItems[i].templates;

        if (templates){
            templates.forEach(function(el){
                if (el.code && stencils[el.code]){
                    res.push(stencils[el.code]);
                }
            });
        } else {
            if (objectTypesItems[i].style && stencils[objectTypesItems[i].style]){
                res.push(stencils[objectTypesItems[i].style]);
            }
        }
    }

    return res;
};

/**
 * Return templates fom store, which exists in stencils object
 */
UserStore.prototype.getAllowedValues = function(metaClass, value) {

    //Берём итам по метаклассу, берём группу по value и собираем все темплейты с такой группой. название делаем по templateGroups.name
    var res = [];

    var item = this.getById(metaClass);
    var group = '';

    if (item.templates){

        item.templates.some(function(el){
            if (el.templateAttributeValue === value && el.group){
                group = el.group;
                return true;
            }
            return false;
        });

        item.templates.forEach(function(el){
            if (el.group === group && el.templateAttributeValue){
                res.push(el.templateAttributeValue);
            }
        });
    }

    return res;
};

/**
 * Return templates fom store, which exists in stencils object
 */
UserStore.prototype.getLabel = function(metaClass, value) {

    //Берём итам по метаклассу, берём группу по value и собираем все темплейты с такой группой. название делаем по templateGroups.name
    var label = '';
    var group = '';
    var item = this.getById(metaClass);

    if (item.templates){

        item.templates.some(function(el){
            if (el.templateAttributeValue && el.templateAttributeValue === value && el.group){
                group = el.group;
                return true;
            }
            return false;
        });

        if (item.templateGroups){
            item.templateGroups.some(function(el){
                if (el.code === group){
                    label = el.name;
                    return true;
                }
                return false;
            })
        }
    }

    return label;
};

/**
 * Return templates fom store, which exists in stencils object
 */
UserStore.prototype.getElementStyle = function(metaClass, value) {

    var style = '';
    var item = this.getById(metaClass);

    if (item.templates){

        item.templates.some(function(el){
            if (el.templateAttributeValue && el.templateAttributeValue === value && el.style){
                style = el.style;
                return true;
            }
            return false;
        });
    }

    return style;
};

/**
 * Return templates fom store, which exists in stencils object
 */
UserStore.prototype.getGroup = function(metaClass, value) {

    var group = '';
    var item = this.getById(metaClass);

    if (item.templates){

        item.templates.some(function(el){
            if (el.templateAttributeValue && el.templateAttributeValue === value && el.group){
                group = el.group;
                return true;
            }
            return false;
        });
    }

    return group;
};
/**
 * Return templates fom store, which exists in stencils object
 */
UserStore.prototype.getTemplateAttribute = function(metaClass) {

    var item = this.getById(metaClass);

    if (item){
        return item.templateAttribute;
    }

    return '';

};
