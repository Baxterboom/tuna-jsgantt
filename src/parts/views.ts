module tuna.gantt {
    export interface IViewTemplate {
        onRender(instance: JSGantt): JQuery[];
        onMounted?(instance: JSGantt, element: JQuery): void;
    }

    export const views: IViews<IViewTemplate> = {
        days: {
            onRender(instance: JSGantt) {
                const range = { ...instance.options.range! };
                return parts.months(instance, range, (item: JQuery, current: moment.Moment) => {
                    const range = Utils.createRange(current, "month");
                    return item.append(parts.weeks(instance, range, (item: JQuery, current: moment.Moment) => {
                        const range = Utils.createRange(current, "week");
                        const days = parts.container(item => item.append(parts.days(instance, range))).addClass(`vn-header`);
                        const columns = parts.container(item => item.append(parts.cells(instance, range, "day"))).addClass(`vn-columns`);
                        return item.append([days, columns]).addClass(`vn-header`);
                    })).addClass(`vn-header`);
                });
            }
        },
        weeks: {
            onRender(instance: JSGantt) {
                const range = { ...instance.options.range! };
                return parts.months(instance, range, (item: JQuery, current: moment.Moment) => {
                    const range = Utils.createRange(current, "month");
                    return item.append(parts.weeks(instance, range));
                });
            }
        },
        months: {
            onRender(instance: JSGantt) {
                const range = { ...instance.options.range! };
                return parts.years(instance, range, (item: JQuery, current: moment.Moment) => {
                    const range = Utils.createRange(current, "year");
                    return item.append(parts.months(instance, range));
                });
            }
        },
        years: {
            onRender(instance: JSGantt) {
                const range = { ...instance.options.range! };
                return parts.years(instance, range);
            }
        }
    };
}