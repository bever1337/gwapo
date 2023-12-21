export interface ClientState {
  access_token: null | string;
  gw2_url: null | string;
  gwapo_edge_url: null | string;
}

export const initialState: ClientState = {
  access_token: null,
  gw2_url: null,
  gwapo_edge_url: null,
};
