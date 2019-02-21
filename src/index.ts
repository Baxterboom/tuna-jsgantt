module tuna.gantt {
    export type View = keyof IViews;

    export interface IOptions {
        data: ITask[];
        view?: View
        views?: View[];
        range?: IRange;
    }

    export interface IRange {
        end: moment.Moment;
        start: moment.Moment;
    }

    export interface ITask<TCustom = any> {
        id: string | number;
        data?: TCustom;
        items: ITaskItem[]
        onClick?(task: ITask): boolean;
    }

    export interface ITaskItem<TCustom = any> {
        id: string | number;
        data?: TCustom;
        range: IRange;
        onClick?(item: ITaskItem): boolean;
    }

    export interface IViews<T = ITemplate> {
        days: T;
        weeks: T;
        months: T;
        years: T;
    }
}