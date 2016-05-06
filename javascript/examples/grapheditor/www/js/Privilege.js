/**
 * Load and set privilege
 */
function Privilege(editorUi, url)
{
    this.editorUi = editorUi;
    this.graph = this.editorUi.editor.graph;
    this.parent = this.graph.getDefaultParent();

    this.init(url);
};

/**
 * Init seting privilege
 */
Privilege.prototype.init = function(url) {
    var _this = this;

    var onload = function(req){
        try {
            var responseData = JSON.parse(req.getText());

            //set enabled/disabled menu items
            if (responseData.allowedMenus !== undefined){
             _this.setMenusPrivileges(responseData.allowedMenus);
             }

             //set visibility of palettes
             if (responseData.allowedPalettes !== undefined){
             _this.setPalettesPrivileges(responseData.allowedPalettes);
             }

        } catch (e){
            console.log('Error while setting privileges',e.stack);
        }
    };

    var onerror = function(req){
        mxUtils.alert('Error while getting privileges from server');
    };

    new mxXmlRequest(url, 'key=value').send(onload, onerror);

};


/**
 * enable/disable manu elements by rights
 */
Privilege.prototype.setMenusPrivileges = function(rights){

    if (rights === undefined){
        return true;
    }

    var _this = this;

    //list of menu items
    var names = ['arrange','view','file','edit','extras','help'];

    //set enable/disable menus
    names.forEach(function(el){
        _this.editorUi.menus.get(el).setEnabled(rights.indexOf(el)>-1);
    })

    //remove paletes
    //_this.editorUi.sidebar.palettes

};

/**
 * remove pallets that don't allow to user
 */
Privilege.prototype.setPalettesPrivileges = function(palettes){

    if (palettes === undefined){
        return true;
    }

    var _this = this;
    var sidebar = _this.editorUi.sidebar;

    //all palettes
    var pals = sidebar.palettes;

    //base palletes that don't be removed
    palettes.push('search');
    //var pals = ['arrange','view','file','edit','extras','help'];

    //set enable/disable menus
    for(var key in pals) {
        if (palettes.indexOf(key) === -1){
            sidebar.removePalette(key)
        }
    }

    //_this.editorUi.sidebar.palettes.forEach(function(el){
    //    _this.editorUi.menus.get(el).setEnabled(rights.indexOf(el)>-1);
    //})

    //remove paletes
    //_this.editorUi.sidebar.palettes

};