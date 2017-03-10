import './common/HelpService';
import './page/HelpPageController';

angular.module('pipHelp', [
    'pipHelp.Service',
    'pipHelp.Page'
]);

export * from './common/HelpService';
export * from './page/HelpPageController';