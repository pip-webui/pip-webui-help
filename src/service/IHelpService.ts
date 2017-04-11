import { HelpTab } from "./HelpTab";

export interface IHelpService {
    getDefaultTab(): HelpTab;
    showTitleText(newTitleText: string): string;
    showTitleLogo(newTitleLogo: string);
    setDefaultTab(name: string): void;
    showNavIcon(value: boolean): boolean;
    getTabs(): HelpTab[];
}

export interface IHelpProvider extends ng.IServiceProvider {
    getDefaultTab(): HelpTab;
    addTab(tabObj: HelpTab): void;
    setDefaultTab(name: string): void;
    getFullStateName(state: string): string;
}