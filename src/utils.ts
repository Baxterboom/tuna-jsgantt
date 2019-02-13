module tuna.gantt {
    export class Utils {
        static createPart(range: IRange, unit: moment.unitOfTime.DurationConstructor, displayFormat: string, classes: string, created?: (current: moment.Moment) => string[]) {
            const result = [""];
            const end = range.end.endOf("day");
            const current = moment(range.start).startOf("day");

            while (current <= end) {
                const childs = created ? created(current.clone()).join("") : "";
                result.push(`<div class="${classes}">
                                <div class="vn-title">${current.format(displayFormat)}</div>
                                <div class="vn-childs">${childs}</div>
                            </div>`);
                current.add(1, unit);
            }

            return result;
        }

        static createRange(date: moment.Moment, unit: moment.unitOfTime.DurationConstructor) {
            return { start: date.clone().startOf(unit), end: date.clone().endOf(unit) };
        }
    }
}