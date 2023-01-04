import { Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

export function Index() {
  return (
    <Fragment>
      <nav>
        <Link to="/pve">
          <img
            alt=""
            src={process.env.PUBLIC_URL + "/icons/System/shield-fill.svg"}
            style={{ height: "2rem", width: "2rem" }}
          />
          <FormattedMessage defaultMessage="PvE" />
        </Link>
        <Link to="/vault/bank">
          <img
            alt=""
            src={process.env.PUBLIC_URL + "/icons/Finance/safe-2-fill.svg"}
            style={{ height: "2rem", width: "2rem" }}
          />
          <FormattedMessage defaultMessage="Vault" />
        </Link>
      </nav>
    </Fragment>
  );
}
