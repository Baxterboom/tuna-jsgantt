module tuna.gantt {
  export class ViewWorker<TArgs, TResult> {
    private worker: Worker;

    constructor(private file: string, success: (response: TResult) => void, private error?: (error: ErrorEvent) => void) {
      this.worker = new Worker(this.file);
      this.worker.onmessage = (message) => success(message.data);

      if (error) this.worker.onerror = (e) => error(e);
    }

    send(args: TArgs) {
      this.worker.postMessage(args);
      return this;
    }

    stop() {
      this.worker.terminate();
    }
  }
} 