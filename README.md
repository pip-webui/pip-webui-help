# <img src="https://github.com/pip-webui/pip-webui/blob/master/doc/Logo.png" alt="Pip.WebUI Logo" style="max-width:30%"> <br/> Help page module

This module provides extendable help-page for LOB applications based on [Pip.WebUI framework](https://github.com/pip-webui/pip-webui). 
Help services allows to fill the help page with predefined and custom tabs. Routing is done by navigating to /#help url.

<div style="border: 1px solid #ccc">
  <img src="https://github.com/pip-webui/pip-webui-help/blob/master/doc/HelpSample.png" alt="Help Page Sample" style="display:block;">
</div>

Help service allows to fill the help with predefined and custom tabs

```javascript
angular
    .module('appHelp', ['pipHelp'])
    .config(function (pipHelpProvider) {
        pipHelpProvider.addPage({
            state: 'test',
            title: 'Test help page',
            auth: true,
            stateConfig: {
                url: '/test',
                template: '<h1>This is test page in help inserted through provider</h1>'
            }
        })
    });
```

## Learn more about the module

- [API Reference](http://htmlpreview.github.io/?https://github.com/pip-webui/pip-webui-help/blob/master/doc/api/index.html)
- [Examples Online](http://webui.pipdevs.com/pip-webui-help/index.html)
- [Pip.WebUI Framework](https://github.com/pip-webui/pip-webui)
- [Pip.WebUI Official Website](http://www.pipwebui.org)

## <a name="dependencies"></a>Module dependencies

* <a href="https://github.com/pip-webui/pip-webui-tasks">pip-webui-tasks</a>
* <a href="https://github.com/pip-webui/pip-webui-lib">pip-webui-lib</a>
* <a href="https://github.com/pip-webui/pip-webui-css">pip-webui-css</a>
* <a href="https://github.com/pip-webui/pip-webui-core">pip-webui-core</a>
* <a href="https://github.com/pip-webui/pip-webui-layouts">pip-webui-layouts</a>

## <a name="license"></a>License

This module is released under [MIT license](License) and totally free for commercial and non-commercial use.

