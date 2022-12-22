import accordionClasses from "./index.module.css";
import hideClasses from "../Elements/Hide.module.css";

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

export function AccordionControl(props: {
  onChange?: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
}) {
  return (
    <label className={classNames(accordionClasses["tab__control"])}>
      <span className={classNames(hideClasses["hide"])}>
        Toggle expanding and hiding data
      </span>
      <span
        role="img"
        aria-label={`Indicates data is ${props.open ? "expanded" : "hidden"}`}
      >
        {props.open ? TRIANGLE_OPEN : TRIANGLE_CLOSED}
      </span>
      <input
        checked={props.open}
        className={classNames(hideClasses["hide"])}
        form="noop"
        onChange={(event) => {
          props.onChange?.(event.target.checked);
        }}
        type="checkbox"
      />
    </label>
  );
}
