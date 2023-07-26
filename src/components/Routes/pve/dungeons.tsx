import dungeonsClasses from "./dungeons.module.css";

import elementsClasses from "../../Elements/index.module.css";
import { Query } from "../../Query";
import { QueryError } from "../../Query/Error";
import { QueryLoading } from "../../Query/Loading";
import { QuerySuccess } from "../../Query/Success";
import { QueryUninitialized } from "../../Query/Uninitialized";

import { classNames } from "../../../features/css/classnames";
import {
  AccountAchievement,
  readAccountAchievements,
} from "../../../features/store/api/read-account-achievements";
import {
  Achievement,
  readAchievements,
} from "../../../features/store/api/read-achievements";
import { FormattedMessage } from "react-intl";
import { Fragment } from "react";

enum AchievementCategory {
  Dungeon = 27,
}

const completeImageSrc = `${process.env.PUBLIC_URL}/icons/System/checkbox-circle-fill.svg`;
const errorImageSrc = `${process.env.PUBLIC_URL}/icons/System/error-warning-fill.svg`;
const loaderImageSrc = `${process.env.PUBLIC_URL}/icons/System/loader-fill.svg`;
const todoImageSrc = `${process.env.PUBLIC_URL}/icons/System/close-circle-fill.svg`;

function DungeonObjectives(props: {
  achievement: Achievement;
  accountAchievement?: AccountAchievement;
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
          const bitComplete = props.accountAchievement?.bits?.includes(index);
          return (
            <li key={index}>
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
  achievement: Achievement;
  accountAchievement?: AccountAchievement;
}) {
  const sumAchievementTiers = (props.achievement?.tiers ?? []).reduce(
    (acc, tier) => acc + (tier?.count ?? 0),
    0
  );
  // DungeonRewards always requires an achievement, but do divide-by-zero sanity check
  const accountAchievementProgressRatio = Math.round(
    ((props.accountAchievement?.current ?? 0) /
      Math.max(1, sumAchievementTiers)) *
      100
  );
  return (
    <>
      <h4 className={classNames(elementsClasses["no-margin"])}>
        <FormattedMessage defaultMessage="Rewards" />
      </h4>
      <label style={{ display: "inline-block" }}>
        <FormattedMessage defaultMessage="Progress" />
        <span style={{ float: "right" }}>
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
              src={errorImageSrc}
            />
          </QueryError>
          <QuerySuccess>{`${accountAchievementProgressRatio}%`}</QuerySuccess>
        </span>
        <br />
        <progress
          max={sumAchievementTiers}
          value={props.accountAchievement?.current ?? 0}
        />
      </label>
      <ol className={classNames(elementsClasses["list--no-style"])}>
        {props.achievement?.tiers.map((tier, index, collection) => {
          // TODO make a separate component
          // decrement account AP as each tier is iterated/rendered
          // this can be o(n)
          const requiredForTier = collection
            .slice(0, index + 1)
            .reduce((acc, prevTier) => acc + (prevTier?.count ?? 0), 0);
          const tierComplete =
            (props.accountAchievement?.current ?? 0) >= requiredForTier;
          return (
            <li key={index}>
              <img
                alt=""
                className={classNames(dungeonsClasses["icon"])}
                src={tierComplete ? completeImageSrc : todoImageSrc}
              />
              Tier {index + 1} - {tier.points} AP
            </li>
          );
        })}
      </ol>
    </>
  );
}

function Dungeon({ achievementId }: { achievementId: number }) {
  const readAccountAchievementsResult = readAccountAchievements.useQueryState(
    {}
  );
  const readAchievementsResult = readAchievements.useQueryState({
    category: AchievementCategory.Dungeon,
  });
  const accountAchievement =
    readAccountAchievementsResult.data?.entities[achievementId];
  const achievement = readAchievementsResult.data!.entities[achievementId];

  return (
    <li className={classNames(dungeonsClasses["item"])} key={achievementId}>
      <h3 className={classNames()}>{achievement?.name}</h3>
      <hr />
      <p className={classNames()}>{achievement?.description}</p>
      <p className={classNames(elementsClasses["no-margin"])}>
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
  const readAchievementsResult = readAchievements.useQuery({
    category: AchievementCategory.Dungeon,
  });
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
    </main>
  );
}
