import accordionClasses from "./index.module.css";
import elementsClasses from "../Elements/index.module.css";

import { classNames } from "../../features/css/classnames";

export function AccordionHeading(props: {
  children: any;
  onChange?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  let childElement = props.children;
  if (props.onChange) {
    childElement = (
      <div
        className={classNames(accordionClasses["tab__heading__padding"])}
        onClick={() => {
          props.onChange?.((previous) => !previous);
        }}
        role="button"
      >
        {props.children}
      </div>
    );
  }
  return (
    <h3
      className={classNames(
        accordionClasses["tab__heading"],
        elementsClasses["no-margin"],
        !props.onChange && accordionClasses["tab__heading__padding"]
      )}
    >
      {childElement}
    </h3>
  );
}
