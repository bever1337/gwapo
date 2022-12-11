import { DumpToPouchSinkState } from "../types";
import type { DumpStateImplementation } from "../types";

export const Sequence: DumpStateImplementation = {
  async close(actions) {
    await actions.flush();
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
    actions.error("Received sequence without docs");
    return DumpToPouchSinkState.Aborted;
  },
};
