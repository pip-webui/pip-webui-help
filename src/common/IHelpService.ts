import {
    HelpTab
} from "../common/HelpConfig";

export interface IHelpService {
    getDefaultTab(): HelpTab;
    showTitleText(newTitleText: string): string;
    showTitleLogo(newTitleLogo: string);
    setDefaultTab(name: string): void;
    showNavIcon(value: boolean): boolean;
    getTabs(): HelpTab[];
}