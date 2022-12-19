import { Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";

import { AccordionControl } from "../Accordion/Control";
import accordionClasses from "../Accordion/index.module.css";
import elementsClasses from "../Elements/index.module.css";
import hideClasses from "../HideA11y/index.module.css";

import { classNames } from "../../features/css/classnames";

export function Installer() {
  const [open, setOpen] = useState(false); // accordion state

  return (
    <Fragment>
      <div className={classNames(accordionClasses["tab"])}>
        <h3
          className={classNames(
            accordionClasses["tab__heading"],
            elementsClasses["no-margin"]
          )}
        >
          <FormattedMessage defaultMessage="Installer" />
        </h3>
        <span className={classNames(accordionClasses["tab__aside"])}>
          {`{{progress}}`}
        </span>
        <AccordionControl onChange={setOpen} open={open} />
      </div>
      <div
        className={classNames(
          accordionClasses["folder"],
          !open && hideClasses["hide"]
        )}
      >
        👷Under Construction👷
      </div>
    </Fragment>
  );
}
