module tuna.gantt {
    import unitOfTime = moment.unitOfTime.DurationConstructor;

    export interface IParts extends IViews<ITemplate> {
        rows(instance: JSGantt, created?: (item: JQuery) => JQuery): JQuery;
        cells(instance: JSGantt, range: IRange, unit: unitOfTime, created?: (item: JQuery) => JQuery): JQuery[];
        container(created: (item: JQuery) => JQuery): JQuery;
    }

    export interface ITemplate {
        (instance: JSGantt, range: IRange, created?: (item: JQuery, current: moment.Moment) => JQuery): JQuery[];
    }

    export const parts: IParts = {
        container(created: (item: JQuery) => JQuery) {
            const element = $(`<div class="vn-childs"></div>`);
            return created ? created(element) : element;
        },
        rows: (instance: JSGantt, created?: (item: JQuery) => JQuery) => {
            const element = $(instance.options.data.Select(s => `<div class="vn-row"></div>`).join("\n"));
            return created ? created(element) : element;
        },
        cells: (instance: JSGantt, range: IRange, unit: unitOfTime, created?: (item: JQuery, current: moment.Moment) => JQuery) => {
            const result: JQuery[] = [];
            Utils.loopRange(range, unit, current => {
                const element = $(`<div class="vn-cell"></div>`);
                result.push(created ? created(element, current) : element);
            });

            return result;
        },
        days: (instance: JSGantt, range: IRange, created?: (item: JQuery, current: moment.Moment) => JQuery) => {
            return Utils.createPart(range, "day", `DD`, created);

        },
        weeks: (instance: JSGantt, range: IRange, created?: (item: JQuery, current: moment.Moment) => JQuery) => {
            return Utils.createPart(range, "week", `[Week] WW`, created);
        },
        months: (instance: JSGantt, range: IRange, created?: (item: JQuery, current: moment.Moment) => JQuery) => {
            return Utils.createPart(range, "month", `MMMM YYYY`, created);

        },
        years: (instance: JSGantt, range: IRange, created?: (item: JQuery, current: moment.Moment) => JQuery) => {
            return Utils.createPart(range, "year", `YYYY`, created);

        }
    };
}