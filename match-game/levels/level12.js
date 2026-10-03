/**
 * Level 12 Configuration: Space Cosmos (Item Objects Level)
 * Matching: Cosmic Body -> Related Space Object (Order scrambled on right side)
 */
window.LEVEL_12_CONFIG = {
  title: "Level 12: Space Cosmos",
  subtitle: "Match celestial wonders with their space companions",
  hintText: "Explore and match cosmos in any order!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "sun", image: "images/sun.svg", name: "Bright Sun", bgColor: "#fefce8" },
    { id: "earth", image: "images/earth.svg", name: "Planet Earth", bgColor: "#ecfeff" },
    { id: "rocket", image: "images/rocket.svg", name: "Space Rocket", bgColor: "#eff6ff" }
  ],
  rightItems: [
    { id: "rocket", image: "images/star.svg", name: "Cosmic Star", bgColor: "#fffbeb" },
    { id: "sun", image: "images/sunglasses.svg", name: "Cool Sunglasses", bgColor: "#fefce8" },
    { id: "earth", image: "images/moon.svg", name: "Crescent Moon", bgColor: "#f5f3ff" }
  ],
  matchingOrder: [
    { leftId: "sun", rightId: "sun" },
    { leftId: "earth", rightId: "earth" },
    { leftId: "rocket", rightId: "rocket" }
  ]
};
