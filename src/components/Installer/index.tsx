import { Fragment, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";

import { AccordionControl } from "../Accordion/Control";
import { AccordionHeading } from "../Accordion/Heading";
import accordionClasses from "../Accordion/index.module.css";
import hideClasses from "../Elements/Hide.module.css";

import { classNames } from "../../features/css/classnames";
import {
  readGwapoDatabaseProgress,
  selectProgress,
} from "../../features/store/api/read-gwapo-database-progress";
import {
  readGwapoDatabases,
  selectBestDatabase,
} from "../../features/store/api/read-gwapo-databases";
import { updateGwapoDatabaseDump } from "../../features/store/api/update-gwapo-database-dump";

export function Installer() {
  const [open, setOpen] = useState(true); // accordion state
  readGwapoDatabases.useQuerySubscription({});
  const progressDatabaseHeader = readGwapoDatabaseProgress.useQuery({});
  const targetDatabase = progressDatabaseHeader.data;
  const bestDatabase = useSelector(selectBestDatabase);
  const progressPercent = useSelector(selectProgress);
  const currentIsBehind =
    !!progressDatabaseHeader.data?._id &&
    !!bestDatabase &&
    progressDatabaseHeader.data?._id !== bestDatabase;
  const [trigger] = updateGwapoDatabaseDump.useMutation({});
  useEffect(() => {
    const request = trigger({});
    return () => {
      request.abort();
    };
  }, [trigger]);
  return (
    <Fragment>
      <div className={classNames(accordionClasses["tab"])}>
        <AccordionHeading onChange={setOpen}>
          <FormattedMessage defaultMessage="Installer" />
        </AccordionHeading>
        <AccordionControl onChange={setOpen} open={open} />
      </div>
      <div
        className={classNames(
          accordionClasses["folder"],
          !open && hideClasses["hide"]
        )}
      >
        <p>👷Under Construction👷</p>
        <label>
          Installing {targetDatabase?._id}. {`${progressPercent}%`} complete.
          <br />
          <progress max={100} value={progressPercent} />
        </label>
        {currentIsBehind && <p>Current version: {bestDatabase}</p>}
      </div>
    </Fragment>
  );
}
