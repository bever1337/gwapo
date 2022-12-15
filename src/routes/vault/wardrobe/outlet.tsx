import { Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Link, Outlet } from "react-router-dom";

import { readArmorWeightClasses } from "../../../features/store/api/read-armor-weight-classes";
import { readArmorSlots } from "../../../features/store/api/read-armor-slots";

export function WardrobeOutlet() {
  readArmorSlots.useQuerySubscription({});
  const readArmorWeightClassesResult = readArmorWeightClasses.useQuery({});
  return (
    <Fragment>
      <h2>
        <FormattedMessage defaultMessage="Wardrobe Storage" />
      </h2>
      <nav>
        <ul>
          <li>
            <Link to="/vault/wardrobe/armor">armor</Link>
            <ul>
              {readArmorWeightClassesResult.data?.map((weightClass) => (
                <li key={weightClass}>
                  <Link to={`/vault/wardrobe/armor/${weightClass}`}>
                    {weightClass}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
      <Outlet />
    </Fragment>
  );
}
