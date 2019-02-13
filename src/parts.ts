module tuna.gantt {
    export interface ITemplate {
        onRender(instance: JSGantt, range: IRange, created?: (range: moment.Moment) => string[]): string[];
    }

    export const parts: IViews<ITemplate> = {
        days: {
            onRender(instance: JSGantt, range: IRange, created: any) {
                return Utils.createPart(range, "day", `DD`, "vn-day", created);
            }
        },
        weeks: {
            onRender(instance: JSGantt, range: IRange, created: any) {
                return Utils.createPart(range, "week", `[Week] WW`, "vn-week", created);
            }
        },
        months: {
            onRender(instance: JSGantt, range: IRange, created: any) {
                return Utils.createPart(range, "month", `MMMM YYYY`, "vn-month", created);
            }
        }
    };
}