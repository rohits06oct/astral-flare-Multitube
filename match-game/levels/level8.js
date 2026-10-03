/**
 * Level 8 Configuration: Sports Champions (Item Objects Level)
 * Matching: Sports Gear -> Goal / Target (Order scrambled on right side)
 */
window.LEVEL_8_CONFIG = {
  title: "Level 8: Sports Equipment",
  subtitle: "Match each sport ball with its scoring goal",
  hintText: "Match sports gear in any order!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "soccer", image: "images/soccer.svg", name: "Soccer Ball", bgColor: "#f0fdf4" },
    { id: "basketball", image: "images/basketball.svg", name: "Basketball", bgColor: "#fff7ed" },
    { id: "star", image: "images/star.svg", name: "Gold Medal Star", bgColor: "#fefce8" }
  ],
  rightItems: [
    { id: "basketball", image: "images/hoop.svg", name: "Basketball Hoop", bgColor: "#fff7ed" },
    { id: "star", image: "images/star.svg", name: "Victory Star", bgColor: "#fefce8" },
    { id: "soccer", image: "images/goal.svg", name: "Soccer Goal", bgColor: "#f0fdf4" }
  ],
  matchingOrder: [
    { leftId: "soccer", rightId: "soccer" },
    { leftId: "basketball", rightId: "basketball" },
    { leftId: "star", rightId: "star" }
  ]
};
