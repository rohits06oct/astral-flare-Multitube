/**
 * LEVEL 1 CONFIGURATION
 * Edit this file to customize items, images, and matching order for Level 1.
 */
window.LEVEL_CONFIG = window.LEVEL_CONFIG || {};

window.LEVEL_CONFIG[1] = {
  levelNumber: 1,
  title: "Quiz 1",
  
  // Allow items to be matched in any order
  enforceMatchingOrder: false,

  // Prompt / description displayed to player
  hintText: "Match items in any order!",

  // Left Column Items (You can add or remove items as you want)
  leftItems: [
    {
      id: "snowflake",
      name: "Snowflake",
      image: "images/snowflake.svg",
      bgColor: "#7eb6ff" // Soft icy blue
    },
    {
      id: "drool_emoji",
      name: "Yummy Emoji",
      image: "images/drool_emoji.svg",
      bgColor: "#ffffff" // Clean white
    },
    {
      id: "cloud",
      name: "Cute Cloud",
      image: "images/cloud.svg",
      bgColor: "#64b5f6" // Sky blue
    }
  ],

  // Right Column Items
  rightItems: [
    {
      id: "rainbow",
      name: "Rainbow",
      image: "images/rainbow.svg",
      bgColor: "#f8bbd0" // Soft pink
    },
    {
      id: "donut",
      name: "Strawberry Donut",
      image: "images/donut.svg",
      bgColor: "#ffe0b2" // Soft peach
    },
    {
      id: "snowman",
      name: "Snowman",
      image: "images/snowman.svg",
      bgColor: "#b2f2bb" // Soft mint green
    }
  ],

  // REQUIRED MATCHING ORDER (Decided by you):
  // 1st: Snowflake -> Snowman
  // 2nd: Yummy Emoji -> Donut
  // 3rd: Cute Cloud -> Rainbow
  matchingOrder: [
    { leftId: "snowflake", rightId: "snowman", label: "Snowflake with Snowman" },
    { leftId: "drool_emoji", rightId: "donut", label: "Emoji with Donut" },
    { leftId: "cloud", rightId: "rainbow", label: "Cloud with Rainbow" }
  ]
};
