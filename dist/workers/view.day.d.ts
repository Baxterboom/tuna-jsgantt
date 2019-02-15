declare module tuna.gantt {
    interface IDayViewMessageEvent<T> extends MessageEvent {
        data: T;
    }
    interface IDayViewMessageEventArguments {
        end: number;
        start: number;
        count: number;
        origin: string;
    }
}
