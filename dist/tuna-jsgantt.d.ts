/// <reference types="jquery" />
/// <reference types="moment" />
declare module tuna.gantt {
    class JSGantt {
        options: IOptions;
        private element;
        private elements;
        constructor(element: JQuery | string, options?: IOptions);
        update(options: IOptions): void;
        render(view?: View): void;
        private setupRows;
        private setupRange;
    }
}
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
}
declare module tuna.gantt {
    class Utils {
        static loopRange(range: IRange, unit: moment.unitOfTime.DurationConstructor, callback: (current: moment.Moment) => void): void;
        static createPart(range: IRange, unit: moment.unitOfTime.DurationConstructor, displayFormat: string, created?: (current: moment.Moment) => string[]): string[];
        static createRange(date: moment.Moment, unit: moment.unitOfTime.DurationConstructor): {
            start: moment.Moment;
            end: moment.Moment;
        };
    }
}
declare module tuna.gantt {
    class ViewWorker<TArgs, TResult> {
        private file;
        private error?;
        private worker;
        constructor(file: string, success: (response: TResult) => void, error?: ((error: ErrorEvent) => void) | undefined);
        send(args: TArgs): this;
        stop(): void;
    }
}
declare module tuna.gantt {
    interface IParts extends IViews<ITemplate> {
        row: ITemplate;
    }
    interface ITemplate {
        onRender(instance: JSGantt, range: IRange, created?: (range: moment.Moment) => string[]): string[];
    }
    const parts: IParts;
}
declare module tuna.gantt {
    interface IViewTemplate {
        onRender(instance: JSGantt): string;
        onMounted?(instance: JSGantt, element: JQuery): void;
    }
    const views: IViews<IViewTemplate>;
}
