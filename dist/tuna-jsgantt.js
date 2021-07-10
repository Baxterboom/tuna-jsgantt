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
                var _this = this;
                if (options === void 0) { options = defaults; }
                this.options = options;
                this.days = new gantt.ViewWorker("dist/workers/view.day.js", function (result) { return _this.elements.body.append(result); }, function (error) { return console.error(error); });
                this.element = $(element);
                this.element.data("JSGantt", this);
                this.element.addClass("vn-gantt");
                this.element.append("\n                <div class=\"vn-root " + options.view + "\">\n                    <div class=\"vn-head\"></div>\n                    <div class=\"vn-body\"></div>\n                </div>\n            ");
                this.elements = {
                    head: this.element.find(".vn-head"),
                    body: this.element.find(".vn-body")
                };
                this.update(options);
                // this.createDummyData(); 
            }
            JSGantt.prototype.update = function (options) {
                this.options = __assign(__assign(__assign({}, defaults), this.options), options);
                this.render(this.options.view);
            };
            JSGantt.prototype.render = function (view) {
                if (view === void 0) { view = this.options.view; }
                console.time("render " + view);
                this.setupRange(this.options);
                var template = gantt.views[view];
                if (!template)
                    console.warn("JSGantt - view " + view + " does not exist");
                var element = template.onRender(this);
                this.elements.body.empty();
                this.elements.head.empty().append(element);
                if (template.onMounted)
                    template.onMounted(this, this.elements.head);
                this.setupRows();
                this.setupEvents();
                console.timeEnd("render " + view);
            };
            JSGantt.prototype.setupEvents = function () {
                var _this = this;
                var views = ["days", "weeks", "months", "years"];
                views.forEach(function (name, index) {
                    var target = _this.elements.head.find(".vn-" + name.slice(0, -1));
                    target.mousedown(function (event) {
                        var target = event.which == 1 ? index - 1 : index;
                        _this.render(views[target]);
                    });
                });
            };
            JSGantt.prototype.setupRows = function () {
                var range = this.options.range;
                this.days.send({ count: this.options.data.length, origin: document.location.origin, start: range.start.valueOf(), end: range.end.valueOf() });
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
                var result = [];
                Utils.loopRange(range, unit, function (current) {
                    var titleHtml = displayFormat ? "<div class=\"vn-title\">" + current.format(displayFormat) + "</div>" : "";
                    var element = $("<div class=\"vn-" + unit + "\">" + titleHtml + "</div>");
                    result.push(created ? created(element, current) : element);
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
            container: function (created) {
                var element = $("<div class=\"vn-childs\"></div>");
                return created ? created(element) : element;
            },
            rows: function (instance, created) {
                var element = $(instance.options.data.Select(function (s) { return "<div class=\"vn-row\"></div>"; }).join("\n"));
                return created ? created(element) : element;
            },
            cells: function (instance, range, unit, created) {
                var result = [];
                gantt.Utils.loopRange(range, unit, function (current) {
                    var element = $("<div class=\"vn-cell\"></div>");
                    result.push(created ? created(element, current) : element);
                });
                return result;
            },
            days: function (instance, range, created) {
                return gantt.Utils.createPart(range, "day", "DD", created);
            },
            weeks: function (instance, range, created) {
                return gantt.Utils.createPart(range, "week", "[Week] WW", created);
            },
            months: function (instance, range, created) {
                return gantt.Utils.createPart(range, "month", "MMMM YYYY", created);
            },
            years: function (instance, range, created) {
                return gantt.Utils.createPart(range, "year", "YYYY", created);
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
                    return gantt.parts.months(instance, range, function (item, current) {
                        var range = gantt.Utils.createRange(current, "month");
                        return item.append(gantt.parts.weeks(instance, range, function (item, current) {
                            var range = gantt.Utils.createRange(current, "week");
                            var days = gantt.parts.container(function (item) { return item.append(gantt.parts.days(instance, range)); }).addClass("vn-header");
                            var columns = gantt.parts.container(function (item) { return item.append(gantt.parts.cells(instance, range, "day")); }).addClass("vn-columns");
                            return item.append([days, columns]).addClass("vn-header");
                        })).addClass("vn-header");
                    });
                }
            },
            weeks: {
                onRender: function (instance) {
                    var range = __assign({}, instance.options.range);
                    return gantt.parts.months(instance, range, function (item, current) {
                        var range = gantt.Utils.createRange(current, "month");
                        return item.append(gantt.parts.weeks(instance, range));
                    });
                }
            },
            months: {
                onRender: function (instance) {
                    var range = __assign({}, instance.options.range);
                    return gantt.parts.years(instance, range, function (item, current) {
                        var range = gantt.Utils.createRange(current, "year");
                        return item.append(gantt.parts.months(instance, range));
                    });
                }
            },
            years: {
                onRender: function (instance) {
                    var range = __assign({}, instance.options.range);
                    return gantt.parts.years(instance, range);
                }
            }
        };
    })(gantt = tuna.gantt || (tuna.gantt = {}));
})(tuna || (tuna = {}));
