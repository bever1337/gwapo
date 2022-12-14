import accordionClasses from "./index.module.css";
import hideClasses from "../HideA11y/index.module.css";

import { classNames } from "../../features/css/classnames";

/**
 * Design language:
 * `gwapo` does not 'flip' an icon to indicate toggled states.
 * For accordion control, prefer rotating 90 degrees. A right-
 * pointing triangle is not be universal for "closed", but
 * it's less ambiguous in the app context.
 */

const TRIANGLE_CLOSED = "\u25B6";
const TRIANGLE_OPEN = "\u25BC";

export function AccordionControl({
  onChange,
  open,
}: {
  onChange: (nextOpen: boolean) => void;
  open: boolean;
}) {
  return (
    <label className={classNames(accordionClasses["tab__control"])}>
      <span className={classNames(hideClasses["hide"])}>
        Toggle expanding and hiding data
      </span>
      <span
        role="img"
        aria-label={`Indicates data is ${open ? "expanded" : "hidden"}`}
      >
        {open ? TRIANGLE_OPEN : TRIANGLE_CLOSED}
      </span>
      <input
        checked={open}
        className={classNames(hideClasses["hide"])}
        form="noop"
        onChange={(event) => {
          onChange(event.target.checked);
        }}
        type="checkbox"
      />
    </label>
  );
}
