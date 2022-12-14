import { Fragment } from "react";
import { Form, Outlet, useLocation, useSearchParams } from "react-router-dom";

export function VaultOutlet() {
  const { pathname } = useLocation();
  const [, setParams] = useSearchParams();
  return (
    <Fragment>
      <Form
        action={pathname}
        id="routerMonoForm"
        name="routerMonoForm"
        method="get"
        onChange={(event) => {
          setParams(
            new URLSearchParams(new FormData(event.currentTarget) as any)
          );
        }}
      >
        <Outlet />
      </Form>
    </Fragment>
  );
}
