import { FormattedMessage } from "react-intl";

import dungeonsClasses from "./dungeons.module.css";

import elementsClasses from "../../Elements/index.module.css";
import { Query } from "../../Query";
import { QueryError } from "../../Query/Error";
import { QueryLoading } from "../../Query/Loading";
import { QuerySuccess } from "../../Query/Success";
import { QueryUninitialized } from "../../Query/Uninitialized";

import { classNames } from "../../../features/css/classnames";
import type { AccountAchievement } from "../../../features/store/api/read-account-achievements";
import { readAccountAchievements } from "../../../features/store/api/read-account-achievements";

import { readAchievements } from "./read-dungeons";
import type { DungeonAchievement } from "./read-dungeons";

const completeImageSrc = `/icons/System/checkbox-circle-fill.svg`;
// const errorImageSrc = `/icons/System/error-warning-fill.svg`;
const loaderImageSrc = `/icons/System/loader-fill.svg`;
const todoImageSrc = `/icons/System/close-circle-fill.svg`;

function DungeonObjectives(props: {
  achievement: DungeonAchievement;
  accountAchievement: AccountAchievement | undefined;
}) {
  if ((props.achievement.bits?.length ?? 0) === 0) {
    return null;
  }
  return (
    <>
      <h4 className={classNames(elementsClasses["no-margin"])}>
        <FormattedMessage defaultMessage="Objectives" />
      </h4>
      <ol className={classNames(elementsClasses["list--no-style"])}>
        {props.achievement?.bits?.map((bit, index) => {
          // this could _theoretically_ iterate a lot for achievements with lots of bits
          // instead, create a mutable array of account achievement bits and shift off bits as-completed
          const bitComplete = props.accountAchievement?.bits?.includes(index);
          return (
            <li key={index}>
              {/* context is 'readAccountAchievements' */}
              <QueryUninitialized>
                <img
                  alt=""
                  className={classNames(dungeonsClasses["icon"])}
                  src={loaderImageSrc}
                />
              </QueryUninitialized>
              <QueryLoading>
                <img
                  alt=""
                  className={classNames(dungeonsClasses["icon"])}
                  src={loaderImageSrc}
                />
              </QueryLoading>
              <QueryError>
                <img
                  alt=""
                  className={classNames(dungeonsClasses["icon"])}
                  src={todoImageSrc}
                />
              </QueryError>
              <QuerySuccess>
                <img
                  alt=""
                  className={classNames(dungeonsClasses["icon"])}
                  src={bitComplete ? completeImageSrc : todoImageSrc}
                />
              </QuerySuccess>
              {bit.type === "Text"
                ? bit.text || `${props.achievement.name} progress`
                : bit.type}
            </li>
          );
        })}
      </ol>
    </>
  );
}

function DungeonRewards(props: {
  achievement: DungeonAchievement;
  accountAchievement: AccountAchievement | undefined;
}) {
  return (
    <>
      <h4 className={classNames(elementsClasses["no-margin"])}>
        <FormattedMessage defaultMessage="Rewards" />
      </h4>
      <ol className={classNames(elementsClasses["list--no-style"])}>
        {props.achievement?.tiers?.map((tier, index) => {
          const tierComplete =
            (props.accountAchievement?.current ?? 0) >= tier.cumulative_count;
          return (
            <li key={index}>
              {/* <img
                alt=""
                className={classNames(dungeonsClasses["icon"])}
                src={tierComplete ? completeImageSrc : todoImageSrc}
              /> */}
              <p>
                <FormattedMessage
                  defaultMessage="Tier {tier}"
                  values={{
                    tier: index + 1,
                  }}
                />
              </p>
              <p>
                <span className={classNames(dungeonsClasses["ratio"])}>
                  {tier.points}
                </span>
                <br />
                Points
              </p>
            </li>
          );
        })}
        {props.achievement.rewards?.map((reward, index) => (
          // warning, index key
          <li key={index}>{reward.type}</li>
        ))}
      </ol>
    </>
  );
}

function Dungeon({ achievementId }: { achievementId: number }) {
  const readAccountAchievementsResult = readAccountAchievements.useQueryState(
    {}
  );
  const readAchievementsResult = readAchievements.useQueryState({});
  const accountAchievement =
    readAccountAchievementsResult.data?.entities[achievementId];
  const achievement = readAchievementsResult.data!.entities[achievementId];

  return (
    <li className={classNames(dungeonsClasses["item"])}>
      <h3 className={classNames(dungeonsClasses["achievement__heading"])}>
        {achievement?.name}
      </h3>
      <p className={classNames()}>
        <FormattedMessage defaultMessage="Tier:" />
        <span className={classNames(dungeonsClasses["ratio"])}>
          <FormattedMessage
            defaultMessage="{currentTier}/{maximumTier}"
            values={{
              currentTier:
                (achievement?.tiers?.findLastIndex(
                  (tier) =>
                    (accountAchievement?.current ?? 0) >= tier.cumulative_count
                ) ?? -1) + 1,
              maximumTier: achievement?.tiers?.length ?? 0,
            }}
          />
        </span>
        <span style={{ display: "inline-block", padding: "0 0.5em" }}>
          {"\u007C"}
        </span>
        <FormattedMessage defaultMessage="Objectives:" />
        <span className={classNames(dungeonsClasses["ratio"])}>
          <FormattedMessage
            defaultMessage="{currentProgress}/{maximumRequired}"
            values={{
              currentProgress: accountAchievement?.bits?.length ?? 0,
              maximumRequired: achievement?.bits?.length ?? 0,
            }}
          />
        </span>
      </p>
      <p className={classNames()}>{achievement?.description}</p>
      <p className={classNames()}>
        <FormattedMessage
          defaultMessage="Requires: {requirement}"
          values={{
            requirement: achievement?.requirement ?? "",
          }}
        />
      </p>
      <DungeonRewards
        achievement={achievement!}
        accountAchievement={accountAchievement}
      />
      <DungeonObjectives
        achievement={achievement!}
        accountAchievement={accountAchievement}
      />
    </li>
  );
}

export function PveDungeons() {
  const readAccountAchievementsResult = readAccountAchievements.useQuery({});
  const readAchievementsResult = readAchievements.useQuery({});
  return (
    <main>
      <Query result={readAchievementsResult}>
        <QueryUninitialized>
          <p>Waiting to load dungeons.</p>
        </QueryUninitialized>
        <QueryLoading>
          <p>Loading dungeons...</p>
        </QueryLoading>
        <QueryError>
          <p>GWAPO encountered an error loading dungeons.</p>
        </QueryError>
        <QuerySuccess>
          <ol className={classNames(dungeonsClasses["list"])}>
            <Query result={readAccountAchievementsResult}>
              {readAchievementsResult.data?.ids.map((achievementId) => (
                <Dungeon
                  achievementId={achievementId as number}
                  key={achievementId}
                />
              ))}
            </Query>
          </ol>
        </QuerySuccess>
      </Query>
      <p>
        <FormattedMessage
          defaultMessage={`\u2020 Per-character dungeon progress cannot be tracked.`}
        />
      </p>
    </main>
  );
}
