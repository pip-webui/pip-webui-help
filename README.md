# <img src="https://github.com/pip-webui/pip-webui/raw/master/doc/Logo.png" alt="Pip.WebUI Logo" style="max-width:30%"> <br/> Extensible help page

![](https://img.shields.io/badge/license-MIT-blue.svg)

Any non-trivial application contains complex functionality. To use it effectively, user may need extra help.
Pip.WebUI.Help module implements extensible help page that can be filled with tabs by application developers.
Each tab may contain help information on various topics

### pipHelp provider

pipHelp provider allows to configure Help page and fill it with tabs.

```javascript
pipHelpProvider.addTab({
    state: 'custom',
    title: 'Custom tab',
    auth: true,
    stateConfig: {
        url: '/custom',
        templateUrl: 'help_custom_tab.html'
    }
});
```

### Help page

Help page implemented as extensible container that can be filled with content tabs.
It can navigated to using **help** state or **/#help** route.

Todo: Replace the image with more realistic help content
<div style="border: 1px solid #ccc">
  <img src="https://github.com/pip-webui/pip-webui-help/raw/master/doc/HelpSample.png" alt="Help Page Sample" style="display:block;">
</div>

## Learn more about the module

- [User's guide](https://github.com/pip-webui/pip-webui-help/blob/master/doc/UsersGuide.md)
- [Online samples](http://webui.pipdevs.com/pip-webui-help/index.html)
- [API reference](http://webui-api.pipdevs.com/pip-webui-help/index.html)
- [Developer's guide](https://github.com/pip-webui/pip-webui-help/blob/master/doc/DevelopersGuide.md)
- [Changelog](https://github.com/pip-webui/pip-webui-help/blob/master/CHANGELOG.md)
- [Pip.WebUI project website](http://www.pipwebui.org)
- [Pip.WebUI project wiki](https://github.com/pip-webui/pip-webui/wiki)
- [Pip.WebUI discussion forum](https://groups.google.com/forum/#!forum/pip-webui)
- [Pip.WebUI team blog](https://pip-webui.blogspot.com/)

## <a name="dependencies"></a>Module dependencies

* [pip-webui-lib](https://github.com/pip-webui/pip-webui-lib): angular, angular material and other 3rd party libraries
* [pip-webui-css](https://github.com/pip-webui/pip-webui-css): CSS styles and web components
* [pip-webui-core](https://github.com/pip-webui/pip-webui-core): localization and other core services
* [pip-webui-layouts](https://github.com/pip-webui/pip-webui-layouts): document layout
* [pip-webui-nav](https://github.com/pip-webui/pip-webui-nav): navigation dropdown

## <a name="license"></a>License

This module is released under [MIT license](License) and totally free for commercial and non-commercial use.
