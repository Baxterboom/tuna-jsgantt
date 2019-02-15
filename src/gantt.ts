module tuna.gantt {

    const defaults = Object.freeze<IOptions>({
        data: [],
        view: "days",
        views: ["days", "weeks", "months"]
    });

    interface IElements {
        head: JQuery;
        body: JQuery;
    }

    export class JSGantt {
        private element: JQuery;
        private elements: IElements;

        constructor(element: JQuery | string, public options: IOptions = defaults) {
            this.element = $(element);
            this.element.addClass("vn-gantt");
            this.element.data("JSGantt", this);

            this.element.append(`
                <div class="vn-root">
                    <div class="vn-head"></div>
                    <div class="vn-body"></div>
                </div>
            `);

            this.elements = {
                head: this.element.find(".vn-head"),
                body: this.element.find(".vn-body")
            };

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

            const template = views[view];
            if (!template) console.warn(`JSGantt - view ${view} does not exist`);

            const html = template.onRender(this);
            const element = $(html);

            if (template.onMounted) template.onMounted(this, element);
            this.elements.head.append(element);

            this.setupRows();
            console.timeEnd("render " + view);
        }

        private setupRows() {
            const range = this.options.range;

            const day = new ViewWorker<IDayViewMessageEventArguments, string>(
                "dist/workers/view.day.js",
                result => this.elements.body.append(`${result}</vn-row>`),
                error => console.error(error));

            day.send({ count: this.options.data.length, origin: document.location.origin, start: range!.start.valueOf(), end: range!.end.valueOf() });
        }

        private setupRange(options: IOptions) {
            if (options.range) return;

            options.range = {
                end: this.options.data.SelectMany(s => s.items.Select(r => r.range.end)).Max() || moment().add(4, "year"),
                start: this.options.data.SelectMany(s => s.items.Select(r => r.range.start)).Min() || moment()
            };
        }
    }
}