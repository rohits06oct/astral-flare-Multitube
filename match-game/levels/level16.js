/**
 * Level 16 Configuration: Hard Weather & Sweet Treats (Master Level)
 * Matching: Elements & Treats -> Companions (Order scrambled on right side)
 */
window.LEVEL_16_CONFIG = {
  title: "Level 16: Weather & Treats",
  subtitle: "Match nature elements and sweet treats with their companions",
  hintText: "Solve the grand puzzle in any order!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "snowflake", image: "images/snowflake.svg", name: "Crystal Snowflake", bgColor: "#e0f2fe" },
    { id: "donut", image: "images/donut.svg", name: "Glazed Donut", bgColor: "#fdf2f8" },
    { id: "cloud", image: "images/cloud.svg", name: "Rainy Cloud", bgColor: "#f1f5f9" },
    { id: "ice_cream", image: "images/ice_cream.svg", name: "Ice Cream", bgColor: "#fefce8" }
  ],
  rightItems: [
    { id: "cloud", image: "images/rainbow.svg", name: "Vibrant Rainbow", bgColor: "#fefce8" },
    { id: "ice_cream", image: "images/orange.svg", name: "Fresh Orange", bgColor: "#ffedd5" },
    { id: "snowflake", image: "images/snowman.svg", name: "Winter Snowman", bgColor: "#e0f2fe" },
    { id: "donut", image: "images/drool_emoji.svg", name: "Happy Face", bgColor: "#fef9c3" }
  ],
  matchingOrder: [
    { leftId: "snowflake", rightId: "snowflake" },
    { leftId: "donut", rightId: "donut" },
    { leftId: "cloud", rightId: "cloud" },
    { leftId: "ice_cream", rightId: "ice_cream" }
  ]
};
