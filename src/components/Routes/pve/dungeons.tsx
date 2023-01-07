import dungeonsClasses from "./dungeons.module.css";

import elementsClasses from "../../Elements/index.module.css";
import { Query } from "../../Query";
import { QueryError } from "../../Query/Error";
import { QueryLoading } from "../../Query/Loading";
import { QuerySuccess } from "../../Query/Success";
import { QueryUninitialized } from "../../Query/Uninitialized";

import { classNames } from "../../../features/css/classnames";
import { readAccountAchievements } from "../../../features/store/api/read-account-achievements";
import { readAchievements } from "../../../features/store/api/read-achievements";

enum AchievementCategory {
  Dungeon = 27,
}

const completeImageSrc = `${process.env.PUBLIC_URL}/icons/System/checkbox-circle-fill.svg`;
const loaderImageSrc = `${process.env.PUBLIC_URL}/icons/System/loader-fill.svg`;
const todoImageSrc = `${process.env.PUBLIC_URL}/icons/System/close-circle-fill.svg`;

export function PveDungeons() {
  const readAccountAchievementsResult = readAccountAchievements.useQuery({});
  const readAchievementsResult = readAchievements.useQuery({
    category: AchievementCategory.Dungeon,
  });
  return (
    <Query result={readAchievementsResult}>
      <QueryUninitialized>Waiting to load dungeons.</QueryUninitialized>
      <QueryLoading>Loading dungeons...</QueryLoading>
      <QueryError>GWAPO encountered an error loading dungeons.</QueryError>
      <QuerySuccess>
        <Query result={readAccountAchievementsResult}>
          <ol className={classNames(dungeonsClasses["list"])}>
            {readAchievementsResult.data?.ids.map((achievementId) => {
              const accountAchievement =
                readAccountAchievementsResult.data?.entities[achievementId];
              const achievement =
                readAchievementsResult.data!.entities[achievementId];
              const tierCountSum = (achievement?.tiers ?? []).reduce(
                (acc, tier) => acc + (tier?.count ?? 0),
                0
              );

              return (
                <li
                  className={classNames(dungeonsClasses["item"])}
                  key={achievementId}
                >
                  <h3 className={classNames()}>{achievement?.name}</h3>
                  <p>{achievement?.description}</p>
                  <p>
                    {achievement?.requirement
                      ? `Requires: ${achievement.requirement}`
                      : ""}
                  </p>
                  {(achievement?.bits?.length ?? 0) > 0 ? (
                    <h4>Objectives</h4>
                  ) : null}
                  <ol
                    className={classNames(
                      elementsClasses["no-padding"],
                      elementsClasses["list--no-style"]
                    )}
                  >
                    {achievement?.bits?.map((bit, index) => {
                      const bitComplete =
                        accountAchievement?.bits?.includes(index);
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
                              src={
                                bitComplete ? completeImageSrc : todoImageSrc
                              }
                            />
                          </QuerySuccess>
                          {bit.type === "Text"
                            ? bit.text || `${achievement.name} progress`
                            : bit.type}
                        </li>
                      );
                    })}
                  </ol>
                  <h4>Reward Tiers</h4>
                  <label>
                    {`Total progress: `}
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
                    <QueryError>0%</QueryError>
                    <QuerySuccess>
                      {Math.min(
                        100,
                        Math.round(
                          ((accountAchievement?.current ?? 0) / tierCountSum) *
                            100
                        )
                      )}
                      {`%`}
                    </QuerySuccess>
                    <br />
                    <progress
                      max={tierCountSum}
                      value={accountAchievement?.current ?? 0}
                    />
                  </label>
                  <ol>
                    {achievement?.tiers.map((tier, index, collection) => {
                      // TODO make a separate component
                      // decrement account AP as each tier is iterated/rendered
                      // this can be o(n)
                      const requiredForTier = collection
                        .slice(0, index + 1)
                        .reduce(
                          (acc, prevTier) => acc + (prevTier?.count ?? 0),
                          0
                        );
                      const tierComplete =
                        (accountAchievement?.current ?? 0) >= requiredForTier;
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
                </li>
              );
            })}
          </ol>
        </Query>
      </QuerySuccess>
    </Query>
  );
}
