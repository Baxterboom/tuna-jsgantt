module tuna.gantt {
  export interface IDayViewMessageEvent<T> extends MessageEvent {
    data: T;
  }

  export interface IDayViewMessageEventArguments {
    end: number;
    start: number;
    origin: string;
  }

  importScripts("https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.js");

  onmessage = function (e: IDayViewMessageEvent<IDayViewMessageEventArguments>) {
    console.time("view.day.worker");
    const data = e.data;
    const end = moment(data.end).startOf("day");
    const start = moment(data.start).startOf("day");
    const result = [""];

    while (start <= end) {
      result.push(`<div class="vn-day">${start.format("d")}</div>`); start.add(1, "day");
    }

    //@ts-ignore
    postMessage(result);
    console.timeEnd("view.day.worker");
  };
}