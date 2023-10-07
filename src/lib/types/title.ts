export interface Title {
  id: number;
  name: string;
  achievement: number;
  achievements: number[];
  ap_required: number;
}
export interface TitleDoc extends Title {
  _id: `titles_${Title["id"]}`;
  $id: "gwapo/titles";
}
