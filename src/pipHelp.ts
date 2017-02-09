/**
 * @file Registration of all help components
 * @copyright Digital Living Software Corp. 2014-2016
 */

import './help_service/HelpService';
import './help_page/HelpPageController';

angular.module('pipHelp', [
    'pipHelp.Service',
    'pipHelp.Page'
]);

export * from './help_service/HelpService';
export * from './help_page/HelpPageController';