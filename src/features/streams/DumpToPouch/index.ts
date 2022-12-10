import { Uninitialized } from "./states/uninitialized";
import { Initialized } from "./states/initialized";
import { Docs } from "./states/docs";
import { Sequence } from "./states/sequence";
import { Aborted } from "./states/aborted";
import { DumpToPouchSinkState } from "./types";
import type { DumpJson, DumpToPouchSinkActions } from "./types";

const states = [Uninitialized, Initialized, Docs, Sequence, Aborted];

export class DumpToPouchSink implements UnderlyingSink<DumpJson> {
  private actions: DumpToPouchSinkActions;
  /** State is defined on stream `start` */
  q?: DumpToPouchSinkState;

  constructor(actions: DumpToPouchSinkActions) {
    this.actions = actions;
  }

  abort() {
    this.q = DumpToPouchSinkState.Aborted;
  }

  async close() {
    const lastState = this.q!;
    this.q = DumpToPouchSinkState.Aborted;
    await states[lastState].close(this.actions);
  }

  start(controller: WritableStreamDefaultController) {
    this.q = DumpToPouchSinkState.Uninitialized;
  }

  async write(chunk: DumpJson, controller: WritableStreamDefaultController) {
    if (this.q === DumpToPouchSinkState.Aborted) {
      return Promise.reject("Wrote to a closed stream");
    }
    if ("version" in chunk) {
      this.q = await states[this.q!].headers(chunk, this.actions);
      return Promise.resolve();
    }
    if ("docs" in chunk) {
      this.q = await states[this.q!].docs(chunk, this.actions);
      return Promise.resolve();
    }
    if ("seq" in chunk) {
      this.q = await states[this.q!].sequence(chunk, this.actions);
      return Promise.resolve();
    }
    return Promise.reject(new Error("Unexpected input"));
  }
}
