import type { AccessToken } from "../../types/token";

export interface ClientState {
  access: (AccessToken & { access_token: string }) | null;
}

export const initialState: ClientState = { access: null };
