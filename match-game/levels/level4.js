/**
 * LEVEL 4 CONFIGURATION
 * Edit this file to customize items, images, and matching order for Level 4.
 */
window.LEVEL_CONFIG = window.LEVEL_CONFIG || {};

window.LEVEL_CONFIG[4] = {
  levelNumber: 4,
  title: "Quiz 4",
  enforceMatchingOrder: true,
  hintText: "Score the goals and baskets in order!",

  leftItems: [
    {
      id: "soccer",
      name: "Soccer Ball",
      image: "images/soccer.svg",
      bgColor: "#e8f5e9"
    },
    {
      id: "basketball",
      name: "Basketball",
      image: "images/basketball.svg",
      bgColor: "#fbe9e7"
    }
  ],

  rightItems: [
    {
      id: "hoop",
      name: "Basketball Hoop",
      image: "images/hoop.svg",
      bgColor: "#ffecb3"
    },
    {
      id: "goal",
      name: "Soccer Goal",
      image: "images/goal.svg",
      bgColor: "#e0f2f1"
    }
  ],

  // REQUIRED MATCHING ORDER:
  // 1st: Soccer -> Goal
  // 2nd: Basketball -> Hoop
  matchingOrder: [
    { leftId: "soccer", rightId: "goal", label: "Kick Soccer into Goal" },
    { leftId: "basketball", rightId: "hoop", label: "Dunk Basketball in Hoop" }
  ]
};
