import { HelpStateConfig } from './HelpStateConfig';

export class HelpTab {
    public state: string;
    public title: string;
    public index: number;
    public access: Function;
    public visible: boolean;
    public stateConfig: HelpStateConfig;
}

