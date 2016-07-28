# Pip.WebUI.Help User's Guide

## <a name="contents"></a> Contents
- [Installing](#install)
- [pipHelp provider](#help_provider)
- [Help page](#help_page)
- [Questions and bugs](#issues)


## <a name="install"></a> Installing

Add dependency to **pip-webui** into your **bower.json** or **package.json** file depending what you use.
```javascript
"dependencies": {
  ...
  "pip-webui": "*"
  ...
}
```

Alternatively you can install **pip-webui** manually using **bower**:
```bash
bower install pip-webui
```

or install it using **npm**:
```bash
npm install pip-webui
```

Include **pip-webui** files into your web application.
```html
<link rel="stylesheet" href=".../pip-webui-lib.min.css"/>
...
<script src=".../pip-webui-lib.min.js"></script>
<script src=".../pip-webui-test.min.js"></script>
```

Register **pipHelp** module in angular module dependencies.
```javascript
angular.module('myApp',[..., 'pipHelp']);
```

## <a name="help_provider"></a> pipHelp provider

**pipHelp** provider allows to configure **Help** page
and dynamically add there tabs during configure and run phases.

### Usage
```javascript
    pipHelpProvider.addTab({
        state: 'custom',
        title: 'Custom tab',
        stateConfig: {
            controller:'CustomTabController',
            url: '/custom',
            templateUrl: 'help_custom_tab.html'
        }
    });
```

### Methods

* **addTab(tab: any): void** - adds a new tab into the **Help** page. The added tab is specified by configuration object that contains tab name, child state and other parameters
  - Params:
    + tab - tab configuration object (see below).

* **getTabs(): any[]** - gets a list of tabs in the **Help** page
  - Returns: array with tab configuration objects
  
* **getDefaultTab(): string** - gets name of the default tab
  - Returns: name of the default tab

* **setDefaultTab(name: string): void** - sets name of the new default tab
  - Params:
    + name - name of the new default tab

### Tab Configuration object

Todo: Add description of the tab configuration fields


## <a name="help_page"></a> Help page

**Help** page is implemented as extensible container that can be dynamically filled with tabs.
On smaller screens the tabs transform into dropdown menu.

Navigation to the **Help** page can be done using **help** state or **/help** route. 
Child state specifies the tab that shall be activated. If child set is not set, it opens the default tab
configured in **pipHelp** provider.

### Usage

```javascript
pipSideNavProvider.sections([{
    links: [
        { title: 'Help', url: '/help' }
    ]
}]);
```

## <a name="issues"></a> Questions and bugs

If you have any questions regarding the module, you can ask them using our 
[discussion forum](https://groups.google.com/forum/#!forum/pip-webui).

Bugs related to this module can be reported using [github issues](https://github.com/pip-webui/pip-webui-test/issues).
