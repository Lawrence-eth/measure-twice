export type RuntimeResult = {
  logs: string[];
  durationMs: number;
};

type WorkerMessage =
  | { type: "log"; value: string }
  | { type: "error"; value: string }
  | { type: "complete" };

const MAX_RUNTIME_MS = 700;

export function runJavaScript(code: string): Promise<RuntimeResult> {
  return new Promise((resolve, reject) => {
    const startedAt = performance.now();
    const logs: string[] = [];
    const workerSource = `
      "use strict";
      const stringify = (value) => {
        if (typeof value === "string") return value;
        try { return JSON.stringify(value); } catch { return String(value); }
      };
      console.log = (...values) => {
        self.postMessage({ type: "log", value: values.map(stringify).join(" ") });
      };
      console.error = console.log;
      self.fetch = () => Promise.reject(new Error("Network access is disabled in experiments."));
      self.XMLHttpRequest = undefined;
      self.WebSocket = undefined;
      self.importScripts = undefined;

      (async () => {
        try {
          ${code}
          await new Promise((finish) => setTimeout(finish, 120));
          self.postMessage({ type: "complete" });
        } catch (error) {
          self.postMessage({
            type: "error",
            value: error instanceof Error ? error.message : String(error),
          });
        }
      })();
    `;
    const blob = new Blob([workerSource], { type: "text/javascript" });
    const workerUrl = URL.createObjectURL(blob);
    const worker = new Worker(workerUrl);

    const cleanup = () => {
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
      window.clearTimeout(timeoutId);
    };

    const timeoutId = window.setTimeout(() => {
      cleanup();
      reject(new Error("Experiment stopped after reaching its time limit."));
    }, MAX_RUNTIME_MS);

    worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
      const message = event.data;

      if (message.type === "log") {
        if (logs.length < 30) logs.push(message.value.slice(0, 200));
        return;
      }

      if (message.type === "error") {
        cleanup();
        reject(new Error(message.value));
        return;
      }

      cleanup();
      resolve({ logs, durationMs: Math.round(performance.now() - startedAt) });
    };

    worker.onerror = (event) => {
      cleanup();
      reject(new Error(event.message || "The experiment failed to run."));
    };
  });
}
