import { createAction } from "@reduxjs/toolkit";

import { AccessToken } from "../types/token";

export const setAccess = createAction<AccessToken>("gwapo/client/setAccess");
