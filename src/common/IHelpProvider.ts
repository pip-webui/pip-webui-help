import {
    HelpTab
} from "../common/HelpConfig";


export interface IHelpProvider extends ng.IServiceProvider {
    getDefaultTab(): HelpTab;
    addTab(tabObj: HelpTab): void;
    setDefaultTab(name: string): void;
    getFullStateName(state: string): string;
}