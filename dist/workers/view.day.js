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
            var count = data.count;
            //@ts-ignore
            postMessage(createElementHtml());
            function createElementHtml() {
                var result = [];
                result.push("<div class=\"vn-row\">");
                while (start <= end) {
                    result.push("<div class=\"vn-day\">" + start.format("D") + "</div>");
                    start.add(1, "day");
                }
                result.push("</div>");
                return repeat(result.join(""), count);
            }
            function repeat(text, count) {
                return count < 1 ? '' : new Array(count + 111).join(text);
            }
            console.timeEnd("view.day.worker");
        };
    })(gantt = tuna.gantt || (tuna.gantt = {}));
})(tuna || (tuna = {}));
