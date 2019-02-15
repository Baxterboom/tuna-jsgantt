"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var tuna;
(function (tuna) {
    var gantt;
    (function (gantt) {
        var defaults = Object.freeze({
            data: [],
            view: "days",
            views: ["days", "weeks", "months"]
        });
        var JSGantt = /** @class */ (function () {
            function JSGantt(element, options) {
                if (options === void 0) { options = defaults; }
                this.options = options;
                this.element = $(element);
                this.element.addClass("vn-gantt");
                this.element.data("JSGantt", this);
                this.element.append("\n                <div class=\"vn-root\">\n                    <div class=\"vn-head\"></div>\n                    <div class=\"vn-body\"></div>\n                </div>\n            ");
                this.elements = {
                    head: this.element.find(".vn-head"),
                    body: this.element.find(".vn-body")
                };
                this.update(options);
                // this.createDummyData(); 
            }
            JSGantt.prototype.update = function (options) {
                this.options = __assign({}, defaults, this.options, options);
            };
            JSGantt.prototype.render = function (view) {
                if (view === void 0) { view = this.options.view; }
                console.time("render " + view);
                this.setupRange(this.options);
                var template = gantt.views[view];
                if (!template)
                    console.warn("JSGantt - view " + view + " does not exist");
                var html = template.onRender(this);
                var element = $(html);
                if (template.onMounted)
                    template.onMounted(this, element);
                this.elements.head.append(element);
                this.setupRows();
                console.timeEnd("render " + view);
            };
            JSGantt.prototype.setupRows = function () {
                var _this = this;
                var range = this.options.range;
                var day = new gantt.ViewWorker("dist/workers/view.day.js", function (result) { return _this.elements.body.append(result + "</vn-row>"); }, function (error) { return console.error(error); });
                day.send({ count: this.options.data.length, origin: document.location.origin, start: range.start.valueOf(), end: range.end.valueOf() });
            };
            JSGantt.prototype.setupRange = function (options) {
                if (options.range)
                    return;
                options.range = {
                    end: this.options.data.SelectMany(function (s) { return s.items.Select(function (r) { return r.range.end; }); }).Max() || moment().add(4, "year"),
                    start: this.options.data.SelectMany(function (s) { return s.items.Select(function (r) { return r.range.start; }); }).Min() || moment()
                };
            };
            return JSGantt;
        }());
        gantt.JSGantt = JSGantt;
    })(gantt = tuna.gantt || (tuna.gantt = {}));
})(tuna || (tuna = {}));
var tuna;
(function (tuna) {
    var gantt;
    (function (gantt) {
        var Utils = /** @class */ (function () {
            function Utils() {
            }
            Utils.loopRange = function (range, unit, callback) {
                var end = range.end.endOf("day");
                var current = moment(range.start).startOf("day");
                while (current <= end) {
                    callback(current);
                    current.add(1, unit);
                }
            };
            Utils.createPart = function (range, unit, displayFormat, created) {
                var result = [""];
                Utils.loopRange(range, unit, function (current) {
                    var childs = created ? created(current.clone()).join("") : "";
                    result.push("<div class=\"vn-" + unit + "\">\n                                <div class=\"vn-title\">" + current.format(displayFormat) + "</div>\n                                <div class=\"vn-childs\">" + childs + "</div>\n                            </div>");
                });
                return result;
            };
            Utils.createRange = function (date, unit) {
                return { start: date.clone().startOf(unit), end: date.clone().endOf(unit) };
            };
            return Utils;
        }());
        gantt.Utils = Utils;
    })(gantt = tuna.gantt || (tuna.gantt = {}));
})(tuna || (tuna = {}));
var tuna;
(function (tuna) {
    var gantt;
    (function (gantt) {
        var ViewWorker = /** @class */ (function () {
            function ViewWorker(file, success, error) {
                this.file = file;
                this.error = error;
                this.worker = new Worker(this.file);
                this.worker.onmessage = function (message) { return success(message.data); };
                if (error)
                    this.worker.onerror = function (e) { return error(e); };
            }
            ViewWorker.prototype.send = function (args) {
                this.worker.postMessage(args);
                return this;
            };
            ViewWorker.prototype.stop = function () {
                this.worker.terminate();
            };
            return ViewWorker;
        }());
        gantt.ViewWorker = ViewWorker;
    })(gantt = tuna.gantt || (tuna.gantt = {}));
})(tuna || (tuna = {}));
var tuna;
(function (tuna) {
    var gantt;
    (function (gantt) {
        gantt.parts = {
            row: {
                onRender: function (instance, range, created) {
                    return instance.options.data.Select(function (s) { return "<div class=\"vn-row\"></div>"; });
                }
            },
            days: {
                onRender: function (instance, range, created) {
                    return gantt.Utils.createPart(range, "day", "DD", created);
                }
            },
            weeks: {
                onRender: function (instance, range, created) {
                    return gantt.Utils.createPart(range, "week", "[Week] WW", created);
                }
            },
            months: {
                onRender: function (instance, range, created) {
                    return gantt.Utils.createPart(range, "month", "MMMM YYYY", created);
                }
            }
        };
    })(gantt = tuna.gantt || (tuna.gantt = {}));
})(tuna || (tuna = {}));
var tuna;
(function (tuna) {
    var gantt;
    (function (gantt) {
        gantt.views = {
            days: {
                onRender: function (instance) {
                    var range = __assign({}, instance.options.range);
                    return gantt.parts.months.onRender(instance, range, function (current) {
                        var range = gantt.Utils.createRange(current, "month");
                        return gantt.parts.weeks.onRender(instance, range, function (current) {
                            var range = gantt.Utils.createRange(current, "week");
                            return gantt.parts.days.onRender(instance, range);
                        });
                    }).join("");
                }
            },
            weeks: {
                onRender: function (_instance) {
                    return "<h1>weeks</h1>";
                }
            },
            months: {
                onRender: function (_instance) {
                    return "<h1>months</h1>";
                }
            }
        };
    })(gantt = tuna.gantt || (tuna.gantt = {}));
})(tuna || (tuna = {}));
