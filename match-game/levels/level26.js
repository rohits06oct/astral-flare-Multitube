/**
 * Level 26 Configuration: Colorful Birds - Water & Tropical Birds
 * Matching: Exotic Bird Species (Order scrambled on right side)
 */
window.LEVEL_26_CONFIG = {
  title: "Level 26: Water & Tropical Birds",
  subtitle: "Match the pink flamingo, royal peacock, and cute duck",
  hintText: "Match colorful birds in any order!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "flamingo", image: "images/flamingo.svg", name: "Pink Flamingo", bgColor: "#fdf2f8" },
    { id: "peacock", image: "images/peacock.svg", name: "Royal Peacock", bgColor: "#ecfeff" },
    { id: "duck", image: "images/duck.svg", name: "Swimming Duck", bgColor: "#fefce8" }
  ],
  rightItems: [
    { id: "peacock", image: "images/peacock.svg", name: "Royal Peacock", bgColor: "#ecfeff" },
    { id: "duck", image: "images/duck.svg", name: "Swimming Duck", bgColor: "#fefce8" },
    { id: "flamingo", image: "images/flamingo.svg", name: "Pink Flamingo", bgColor: "#fdf2f8" }
  ],
  matchingOrder: [
    { leftId: "flamingo", rightId: "flamingo" },
    { leftId: "peacock", rightId: "peacock" },
    { leftId: "duck", rightId: "duck" }
  ]
};
