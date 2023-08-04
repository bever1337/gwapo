export interface Mini {
  id: number;
}
export interface MiniDoc extends Mini {
  _id: `minis_${Mini["id"]}`;
  $id: "gwapo/minis";
}
