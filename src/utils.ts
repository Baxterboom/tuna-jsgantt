module tuna.gantt {
    export class Utils {
        static loopRange(range: IRange, unit: moment.unitOfTime.DurationConstructor, callback: (current: moment.Moment) => void) {
            const end = range.end.endOf("day");
            const current = moment(range.start).startOf("day");

            while (current <= end) {
                callback(current);
                current.add(1, unit);
            }
        }

        static createPart(range: IRange, unit: moment.unitOfTime.DurationConstructor, displayFormat: string, created?: (current: moment.Moment) => string[]) {
            const result = [""];

            Utils.loopRange(range, unit, current => {
                const childs = created ? created(current.clone()).join("") : "";
                const titleHtml = displayFormat ? `<div class="vn-title">${current.format(displayFormat)}</div>` : ``;
                const childsHtml = childs ? `<div class="vn-childs">${childs}</div>` : ``;
                result.push(`<div class="vn-${unit}">${titleHtml}${childsHtml}</div>`);
            });

            return result;
        }

        static createRange(date: moment.Moment, unit: moment.unitOfTime.DurationConstructor) {
            return { start: date.clone().startOf(unit), end: date.clone().endOf(unit) };
        }
    }
}