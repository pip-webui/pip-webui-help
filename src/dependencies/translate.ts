/**
 * @file Optional filter to translate string resources
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
/* global angular */

(() => {
    'use strict';

    angular.module('pipHelp.Translate', [])
           .filter('translate', ($injector) => {
        let pipTranslate = $injector.has('pipTranslate') 
            ? $injector.get('pipTranslate') : null;

        return (key) => {
            return pipTranslate  ? pipTranslate.translate(key) || key : key;
        }
    });

})();
