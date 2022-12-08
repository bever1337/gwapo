import { AccountBankItem } from "../store/api/read-account-bank";
import materialsClasses from "./material.module.css";

export function VaultItem(props: { accountBankItem: AccountBankItem | null }) {
  return (
    <li className={[materialsClasses["material__item"]].join(" ")}>
      {props.accountBankItem?.id ?? "x"}
    </li>
  );
}
