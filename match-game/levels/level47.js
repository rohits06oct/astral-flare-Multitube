/**
 * Level 47 Configuration: Ocean Marine Wildlife
 * Matching: Word Name on Left -> Object Image on Right
 */
window.LEVEL_47_CONFIG = {
  title: "Level 47: Ocean Wildlife",
  subtitle: "Match sea creature names with their pictures",
  hintText: "Match marine words to their pictures!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "dolphin", text: "Dolphin", name: "Dolphin", bgColor: "#eff6ff" },
    { id: "turtle", text: "Sea Turtle", name: "Sea Turtle", bgColor: "#f0fdf4" },
    { id: "whale", text: "Blue Whale", name: "Blue Whale", bgColor: "#f0f9ff" }
  ],
  rightItems: [
    { id: "turtle", image: "images/turtle.svg", name: "Swimming Sea Turtle", bgColor: "#f0fdf4" },
    { id: "whale", image: "images/whale.svg", name: "Majestic Blue Whale", bgColor: "#f0f9ff" },
    { id: "dolphin", image: "images/dolphin.svg", name: "Playful Dolphin", bgColor: "#eff6ff" }
  ],
  matchingOrder: [
    { leftId: "dolphin", rightId: "dolphin" },
    { leftId: "turtle", rightId: "turtle" },
    { leftId: "whale", rightId: "whale" }
  ]
};
