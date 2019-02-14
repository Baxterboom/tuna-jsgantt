"use strict";
var tuna;
(function (tuna) {
    var gantt;
    (function (gantt) {
        importScripts("https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.js");
        onmessage = function (e) {
            console.time("view.day.worker");
            var data = e.data;
            var end = moment(data.end).startOf("day");
            var start = moment(data.start).startOf("day");
            var result = [""];
            while (start <= end) {
                result.push("<div class=\"vn-day\">" + start.format("d") + "</div>");
                start.add(1, "day");
            }
            //@ts-ignore
            postMessage(result);
            console.timeEnd("view.day.worker");
        };
    })(gantt = tuna.gantt || (tuna.gantt = {}));
})(tuna || (tuna = {}));
