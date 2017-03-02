'use strict';

import {HelpTab} from "../help_common/HelpTab";
import {HelpConfig} from "../help_common/HelpConfig";

export interface IHelpService {
    getDefaultTab(): HelpTab;
    showTitleText (newTitleText: string): string;
    showTitleLogo(newTitleLogo: string);
    setDefaultTab(name: string): void;
    showNavIcon(value): boolean;
    getTabs(): HelpTab[];
}

export class HelpService implements IHelpService {

    public constructor( private _config: HelpConfig) {
        "ngInject";
    }

    private getFullStateName(state: string): string {
        return 'help.' + state;
    }

    public setDefaultTab(name: string): void {
        if (!_.find(this._config.tabs, (tab) => {
            return tab.state === 'help.' + name;
        })) {
            throw new Error('Tab with state name "' + name + '" is not registered');
        }

        this._config.defaultTab = this.getFullStateName(name);
    }

    public getDefaultTab(): HelpTab {
        let defaultTab: HelpTab;
        defaultTab = _.find(this._config.tabs, (p: HelpTab) => {
            return p.state === this._config.defaultTab;
        });
        return _.cloneDeep(defaultTab);
    }

    public showTitleText (newTitleText: string): string {
        if (newTitleText) {
            this._config.titleText = newTitleText;
            this._config.titleLogo = null;
        }

        return this._config.titleText;
    }

    public showTitleLogo(newTitleLogo: string): string {
        if (newTitleLogo) {
            this._config.titleLogo = newTitleLogo;
            this._config.titleText = null;
        }

        return this._config.titleLogo;
    }

    public showNavIcon(value: boolean): boolean {
        if (value !== null && value !== undefined) {
            this._config.isNavIcon = !!value;
        }

        return this._config.isNavIcon;
    }

    public getTabs(): HelpTab[] {
        return _.cloneDeep(this._config.tabs);
    }

}



