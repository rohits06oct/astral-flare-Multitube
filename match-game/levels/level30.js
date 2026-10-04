/**
 * Level 30 Configuration: Desert Expedition
 * Matching: Word Name on Left -> Object Image on Right
 */
window.LEVEL_30_CONFIG = {
  title: "Level 30: Desert Expedition",
  subtitle: "Match desert terms with their pictures",
  hintText: "Match desert words to their pictures!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "camel2", text: "Camel", name: "Camel", bgColor: "#fef3c7" },
    { id: "dunes", text: "Dunes", name: "Sand Dunes", bgColor: "#fff7ed" },
    { id: "cactus2", text: "Cactus", name: "Cactus", bgColor: "#f0fdf4" }
  ],
  rightItems: [
    { id: "dunes", image: "images/dunes.svg", name: "Golden Sand Dunes", bgColor: "#fff7ed" },
    { id: "cactus2", image: "images/cactus.svg", name: "Desert Saguaro", bgColor: "#f0fdf4" },
    { id: "camel2", image: "images/camel.svg", name: "Desert Camel", bgColor: "#fef3c7" }
  ],
  matchingOrder: [
    { leftId: "camel2", rightId: "camel2" },
    { leftId: "dunes", rightId: "dunes" },
    { leftId: "cactus2", rightId: "cactus2" }
  ]
};
