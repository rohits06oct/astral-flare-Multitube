/**
 * LEVEL 3 CONFIGURATION
 * Edit this file to customize items, images, and matching order for Level 3.
 */
window.LEVEL_CONFIG = window.LEVEL_CONFIG || {};

window.LEVEL_CONFIG[3] = {
  levelNumber: 3,
  title: "Level 3",
  enforceMatchingOrder: false,
  hintText: "Connect the cosmic pairs in any order!",

  leftItems: [
    {
      id: "sun",
      name: "Sunny Sun",
      image: "images/sun.svg",
      bgColor: "#fff8e1"
    },
    {
      id: "earth",
      name: "Planet Earth",
      image: "images/earth.svg",
      bgColor: "#e1f5fe"
    },
    {
      id: "rocket",
      name: "Space Rocket",
      image: "images/rocket.svg",
      bgColor: "#ede7f6"
    }
  ],

  rightItems: [
    {
      id: "moon",
      name: "Crescent Moon",
      image: "images/moon.svg",
      bgColor: "#fff9c4"
    },
    {
      id: "sunglasses",
      name: "Cool Shades",
      image: "images/sunglasses.svg",
      bgColor: "#cfd8dc"
    },
    {
      id: "star",
      name: "Twinkling Star",
      image: "images/star.svg",
      bgColor: "#ffe082"
    }
  ],

  // REQUIRED MATCHING ORDER:
  // 1st: Sun -> Sunglasses
  // 2nd: Earth -> Moon
  // 3rd: Rocket -> Star
  matchingOrder: [
    { leftId: "sun", rightId: "sunglasses", label: "Sun wears Sunglasses" },
    { leftId: "earth", rightId: "moon", label: "Earth orbits with Moon" },
    { leftId: "rocket", rightId: "star", label: "Rocket journeys to Star" }
  ]
};
