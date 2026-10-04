/**
 * Level 39 Configuration: Birds of Lake & Coast
 * Matching: Word Name on Left -> Object Image on Right
 */
window.LEVEL_39_CONFIG = {
  title: "Level 39: Lake & Shore Birds",
  subtitle: "Match bird names with their pictures",
  hintText: "Match bird names to their pictures!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "swan", text: "Swan", name: "Swan", bgColor: "#f0fdf4" },
    { id: "woodpecker", text: "Woodpecker", name: "Woodpecker", bgColor: "#fef2f2" },
    { id: "seagull", text: "Seagull", name: "Seagull", bgColor: "#eff6ff" }
  ],
  rightItems: [
    { id: "woodpecker", image: "images/woodpecker.svg", name: "Crimson Woodpecker", bgColor: "#fef2f2" },
    { id: "seagull", image: "images/seagull.svg", name: "Coastal Seagull", bgColor: "#eff6ff" },
    { id: "swan", image: "images/swan.svg", name: "Graceful White Swan", bgColor: "#f0fdf4" }
  ],
  matchingOrder: [
    { leftId: "swan", rightId: "swan" },
    { leftId: "woodpecker", rightId: "woodpecker" },
    { leftId: "seagull", rightId: "seagull" }
  ]
};
