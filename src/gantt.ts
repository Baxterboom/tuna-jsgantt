module tuna.gantt {

    const defaults = Object.freeze<IOptions>({
        data: [],
        view: "days",
        views: ["days", "weeks", "months"]
    });

    export class JSGantt {
        private element: JQuery;

        constructor(element: JQuery | string, public options: IOptions = defaults) {
            this.element = $(element);
            this.element.addClass("vn-gantt");
            this.element.append(`<div class="vn-root"></div>`);
            this.element.data("JSGantt", this);
            this.update(options);
            // this.createDummyData(); 
        }

        public update(options: IOptions) {
            this.options = {
                ...defaults,
                ...this.options,
                ...options
            };
        }

        public render(view: View = this.options.view!) {
            console.time("render " + view);
            this.setupRange(this.options);

            const range = this.options.range;

            const template = views[view];
            if (!template) console.warn(`JSGantt - view ${view} does not exist`);

            const html = template.onRender(this);
            const target = this.element.find(".vn-root:first");
            const element = $(html);

            const day = new ViewWorker<any, string>("dist/workers/view.day.js",
                result => target.append(result), error => console.error(error))
                .send({ origin: document.location.origin, start: range!.start.valueOf(), end: range!.end.valueOf() });

            if (template.onMounted) template.onMounted(this, element);
            target.append(element);
            console.timeEnd("render " + view);
        }

        private setupRange(options: IOptions) {
            if (options.range) return;

            options.range = {
                end: this.options.data.SelectMany(s => s.items.Select(r => r.range.end)).Max() || moment().add(11, "year"),
                start: this.options.data.SelectMany(s => s.items.Select(r => r.range.start)).Min() || moment()
            };
        }
    }
}