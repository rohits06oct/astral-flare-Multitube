/**
 * Level 30 Configuration: Desert Expedition - Safari Caravan
 * Matching: Camel Caravan and Dunes (Order scrambled on right side)
 */
window.LEVEL_30_CONFIG = {
  title: "Level 30: Desert Expedition",
  subtitle: "Match the desert camel, golden dunes, and cactus",
  hintText: "Cross the desert sands in any order!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "camel2", image: "images/camel.svg", name: "Desert Camel", bgColor: "#fef3c7" },
    { id: "dunes", image: "images/dunes.svg", name: "Golden Sand Dunes", bgColor: "#fff7ed" },
    { id: "cactus2", image: "images/cactus.svg", name: "Desert Saguaro", bgColor: "#f0fdf4" }
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
