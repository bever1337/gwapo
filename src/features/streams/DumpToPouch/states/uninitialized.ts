import { DumpToPouchSinkState } from "../types";
import type { DumpStateImplementation } from "../types";

export const Uninitialized: DumpStateImplementation = {
  async close(actions) {
    return DumpToPouchSinkState.Aborted;
  },
  async docs(input, actions) {
    actions.error("Headers must be first input");
    return DumpToPouchSinkState.Aborted;
  },
  async headers(input, actions) {
    await actions.initialize(input);
    return DumpToPouchSinkState.Initialized;
  },
  async sequence(input, actions) {
    actions.error("Headers must be first input");
    return DumpToPouchSinkState.Aborted;
  },
};
