module tuna.gantt {
    export interface IParts extends IViews<ITemplate> {
        row: ITemplate;
    }

    export interface ITemplate {
        onRender(instance: JSGantt, range: IRange, created?: (range: moment.Moment) => string[]): string[];
    }

    export const parts: IParts = {
        row: {
            onRender(instance: JSGantt, range: IRange, created?: (range: moment.Moment) => string[]) {
                return instance.options.data.Select(s => `<div class="vn-row"></div>`)
            }
        },
        days: {
            onRender(instance: JSGantt, range: IRange, created?: (range: moment.Moment) => string[]) {
                return Utils.createPart(range, "day", `DD`, created);
            }
        },
        weeks: {
            onRender(instance: JSGantt, range: IRange, created?: (range: moment.Moment) => string[]) {
                return Utils.createPart(range, "week", `[Week] WW`, created);
            }
        },
        months: {
            onRender(instance: JSGantt, range: IRange, created?: (range: moment.Moment) => string[]) {
                return Utils.createPart(range, "month", `MMMM YYYY`, created);
            }
        }
    };
}