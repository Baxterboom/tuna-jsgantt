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

        static createPart(range: IRange, unit: moment.unitOfTime.DurationConstructor, displayFormat?: string, created?: (item: JQuery, current: moment.Moment) => JQuery): JQuery[] {
            const result: JQuery[] = [];

            Utils.loopRange(range, unit, current => {
                const titleHtml = displayFormat ? `<div class="vn-title">${current.format(displayFormat)}</div>` : ``;
                const element = $(`<div class="vn-${unit}">${titleHtml}</div>`);
                result.push(created ? created(element, current) : element);
            });

            return result;
        }

        static createRange(date: moment.Moment, unit: moment.unitOfTime.DurationConstructor) {
            return { start: date.clone().startOf(unit), end: date.clone().endOf(unit) };
        }
    }
}