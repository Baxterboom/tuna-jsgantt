module tuna.gantt {
    export interface IViewTemplate {
        onRender(instance: JSGantt): string;
        onMounted?(instance: JSGantt, element: JQuery): void;
    }

    export const views: IViews<IViewTemplate> = {
        days: {
            onRender(instance: JSGantt): string {
                const range = { ...instance.options.range! };
                return parts.months.onRender(instance, range, current => {
                    const range = Utils.createRange(current, "month");
                    return parts.weeks.onRender(instance, range, current => {
                        const range = Utils.createRange(current, "week");
                        return parts.days.onRender(instance, range);
                    });
                }).join("");
            }
        },
        weeks: {
            onRender(_instance: JSGantt): string {
                return `<h1>weeks</h1>`
            }
        },
        months: {
            onRender(_instance: JSGantt): string {
                return `<h1>months</h1>`
            }
        }
    };
}