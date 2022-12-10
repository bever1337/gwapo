import { DumpToPouchSinkState } from "../types";
import type { DumpStateImplementation } from "../types";

export const Docs: DumpStateImplementation = {
  async close(actions) {
    return DumpToPouchSinkState.Aborted;
  },
  async docs(input, actions) {
    actions.error("Received non-sequenced docs");
    return DumpToPouchSinkState.Aborted;
  },
  async headers(input, actions) {
    actions.error("Headers appears twice in dump");
    return DumpToPouchSinkState.Aborted;
  },
  async sequence(input, actions) {
    await actions.flush(input.seq);
    return DumpToPouchSinkState.Sequence;
  },
};
