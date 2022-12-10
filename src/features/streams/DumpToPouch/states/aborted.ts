import { DumpToPouchSinkState } from "../types";
import type { DumpStateImplementation } from "../types";

export const Aborted: DumpStateImplementation = {
  async close(actions) {
    return DumpToPouchSinkState.Aborted;
  },
  async docs(input, actions) {
    return DumpToPouchSinkState.Aborted;
  },
  async headers(input, actions) {
    return DumpToPouchSinkState.Aborted;
  },
  async sequence(input, actions) {
    return DumpToPouchSinkState.Aborted;
  },
};
