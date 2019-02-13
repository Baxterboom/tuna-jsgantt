/// <reference types="moment" />
/// <reference types="jquery" />
declare module tuna.gantt {
    type View = keyof IViews;
    interface IOptions {
        data: ITask[];
        view?: View;
        views?: View[];
        range?: IRange;
    }
    interface IRange {
        end: moment.Moment;
        start: moment.Moment;
    }
    interface ITask<TCustom = any> {
        id: string | number;
        data?: TCustom;
        items: ITaskItem[];
        onClick?(task: ITask): boolean;
    }
    interface ITaskItem<TCustom = any> {
        id: string | number;
        data?: TCustom;
        range: IRange;
        onClick?(item: ITaskItem): boolean;
    }
    interface IViews<T = ITemplate> {
        days: T;
        weeks: T;
        months: T;
    }
    interface ITemplate {
        onRender(instance: JSGantt, range: IRange, created?: (range: moment.Moment) => string[]): string[];
    }
    interface IViewTemplate {
        onRender(instance: JSGantt): string;
        onMounted?(instance: JSGantt, element: JQuery): void;
    }
    class JSGantt {
        options: IOptions;
        private element;
        constructor(element: JQuery | string, options?: IOptions);
        update(options: IOptions): void;
        render(view?: View): void;
        private setupRange;
        private createDummyData;
    }
}
declare module tuna.gantt {
    const parts: IViews<ITemplate>;
}
declare module tuna.gantt {
    class Utils {
        static createPart(range: IRange, unit: moment.unitOfTime.DurationConstructor, displayFormat: string, classes: string, created?: (current: moment.Moment) => string[]): string[];
        static createRange(date: moment.Moment, unit: moment.unitOfTime.DurationConstructor): {
            start: moment.Moment;
            end: moment.Moment;
        };
    }
}
declare module tuna.gantt {
    const views: IViews<IViewTemplate>;
}
