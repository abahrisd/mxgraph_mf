/**
 * Load and store attributes values, for further objects/panels construction
 */
function UserStore(url, data, idValue)
{
    //this.editorUi = editorUi;
    //this.graph = this.editorUi.editor.graph;

    //object for storing link types
    //this.__linkTypes = [];

    //this.origin = window.location.origin;
    //this.getPath = window.location.getPath;

    this.origin = 'http://217.74.43.104:8080';
    this.queryStr = globalQueryString;

    //overwright edge validator
    this._items = {};
    this.idValue = idValue;
    this.init(url, data);
};

/**
 * Find path for REST request
 */
UserStore.prototype.findPath = '/sd/services/rest/find/';

/**
 * Init setting privilege
 */
UserStore.prototype.init = function (url, data) {
    var _this = this;
    var responseData;

    if (url && data) {
        console.log("Нельзя указать url и data одновременно");
        return;
    }

    if (url) {
        responseData = this.loadData(url);
    } else if (data) {
        responseData = data;
    }

    if (responseData) {
        responseData.forEach(function (el) {
            if (el.imported && el.code) {

                var importUrl = _this.origin + _this.findPath + el.code + '?accessKey=' + _this.queryStr.accessKey;
                var req = mxUtils.load(importUrl);
                var importResponse = JSON.parse(req.getText());
                el.importedObjects = [];

                importResponse.forEach(function (item) {
                    var importItem = {};

                    if (item.code) {
                        importItem.code = item.code;
                    }

                    if (item.metaClass) {
                        importItem.metaClass = item.metaClass;
                    }

                    if (item.description) {
                        importItem.description = item.description;
                    }

                    if (item.title) {
                        importItem.title = item.title;
                    }

                    if (item.UUID) {
                        importItem.UUID = item.UUID;
                    }

                    el.importedObjects.push(importItem);

                });
            }

            _this._add(el);
        });
    }

    //this.createValidateListener();

};

/**
 * Synchronously load file from server and add it to store
 */
UserStore.prototype.loadData = function (url) {

    var _this = this;
    try {
        var req = mxUtils.load(url);
        return JSON.parse(req.getText());
    } catch (e) {
        console.log('Error on load store', e.stack);
    }
};

/**
 * Add attribute object in store
 */
UserStore.prototype._add = function (item) {
    this._items[item[this.idValue]] = item;
};

/**
 * Add attribute object in store
 */
UserStore.prototype.getById = function (id) {
    return this._items[id];
};

/**
 * Return all items
 */
UserStore.prototype.getAll = function () {
    return this._items;
};

/**
 * Return all items
 */
UserStore.prototype.getCount = function () {
    return Object.keys(this._items).length;
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
UserStore.prototype.getElementCode = function(metaClass, value) {

    var code = '';
    var item = this.getById(metaClass);

    if (item.templates){

        if (item.templates.length === 1){

            return item.templates[0].code;
        }

        item.templates.some(function(el){
            if (el.templateAttributeValue && el.templateAttributeValue === value && el.code){
                code = el.code;
                return true;
            }
            return false;
        });
    }

    return code;
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

    return null;

};

/**
 * Get style, when templateAttribute is null
 */
UserStore.prototype.getBaseStyle = function(metaClass) {

    var item = this.getById(metaClass);

    if (item && item.templates){

        return item.templates[0].style;
    }

    return '';

};

/**
 * Get style, when templateAttribute is null
 */
UserStore.prototype.getCellTmp = function(cell) {

    if (!cell){
        return '';
    }

    var metaClass = cell.getValue().getAttribute('metaClass');
    var item = this.getById(metaClass);
    var tempAttr = item.templateAttribute;
    var tempAttrValue = cell.getValue().getAttribute(tempAttr);

    return this.getElementCode(metaClass, tempAttrValue);

};

/**
 * Get style, when templateAttribute is null
 */
UserStore.prototype.getImportedObjects = function() {

    var importedObjects = [];

    for (var i in this._items) {
        if (this._items.hasOwnProperty(i) && this._items[i].importedObjects){
            importedObjects.push({
                code: i,
                name: this._items[i].name,
                multiple: this._items[i].multiple,
                items:this._items[i].importedObjects
            });
        }
    }

    return importedObjects;
};


/**
 * Get style, when templateAttribute is null
 */
UserStore.prototype.isMultiple = function(metaClass) {
    return this.getById(metaClass).multiple;
};
