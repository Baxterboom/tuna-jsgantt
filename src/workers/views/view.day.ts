module tuna.gantt {
  export interface IDayViewMessageEvent<T> extends MessageEvent {
    data: T;
  }

  export interface IDayViewMessageEventArguments {
    end: number;
    start: number;
    count: number;
    origin: string;
  }

  importScripts("https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.js");

  onmessage = function (e: IDayViewMessageEvent<IDayViewMessageEventArguments>) {
    console.time("view.day.worker");

    const data = e.data;
    const end = moment(data.end).startOf("day");
    const start = moment(data.start).startOf("day");
    const count = data.count;

    //@ts-ignore
    postMessage(createElementHtml());

    function createElementHtml() {
      const result: string[] = [];
      result.push(`<div class="vn-row">`);
      while (start <= end) {
        // result.push(`<div class="vn-day">${start.format("D")}</div>`);
        // result.push(`<div class="vn-day"></div>`);
        start.add(1, "day");
      }
      result.push("</div>");
      return repeat(result.join(""), count);
    }

    function repeat(text: string, count: number) {
      return count < 1 ? '' : new Array(count).join(text);
    }

    console.timeEnd("view.day.worker");
  };
}