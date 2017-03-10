{
    function filter($injector: ng.auto.IInjectorService) {
         let pipTranslate: any = $injector.has('pipTranslate') 
            ? $injector.get('pipTranslate') : null;

        return (key) => {
            return pipTranslate  ? pipTranslate.translate(key) || key : key;
        }
    }

    angular.module('pipHelp.Translate', [])
           .filter('translate', filter);

}
