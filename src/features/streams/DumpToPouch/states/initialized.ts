import { DumpToPouchSinkState } from "../types";
import type { DumpStateImplementation } from "../types";

export const Initialized: DumpStateImplementation = {
  async close(actions) {
    return DumpToPouchSinkState.Aborted;
  },
  async docs(input, actions) {
    actions.buffer(input.docs);
    return DumpToPouchSinkState.Docs;
  },
  async headers(input, actions) {
    actions.error("Headers appears twice in dump");
    return DumpToPouchSinkState.Aborted;
  },
  async sequence(input, actions) {
    actions.error("Received sequence before docs");
    return DumpToPouchSinkState.Aborted;
  },
};
