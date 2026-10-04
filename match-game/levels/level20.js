/**
 * Level 20 Configuration: Desert Wonders - Camel & Oasis
 * Matching: Desert Objects (Order scrambled on right side)
 */
window.LEVEL_20_CONFIG = {
  title: "Level 20: Desert Camel & Oasis",
  subtitle: "Match the desert camel, cactus, and oasis wonders",
  hintText: "Explore and match desert items in any order!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "camel", image: "images/camel.svg", name: "Desert Camel", bgColor: "#fef3c7" },
    { id: "cactus", image: "images/cactus.svg", name: "Saguaro Cactus", bgColor: "#f0fdf4" },
    { id: "oasis", image: "images/oasis.svg", name: "Desert Oasis", bgColor: "#eff6ff" }
  ],
  rightItems: [
    { id: "cactus", image: "images/cactus.svg", name: "Saguaro Cactus", bgColor: "#f0fdf4" },
    { id: "oasis", image: "images/oasis.svg", name: "Desert Oasis", bgColor: "#eff6ff" },
    { id: "camel", image: "images/camel.svg", name: "Desert Camel", bgColor: "#fef3c7" }
  ],
  matchingOrder: [
    { leftId: "camel", rightId: "camel" },
    { leftId: "cactus", rightId: "cactus" },
    { leftId: "oasis", rightId: "oasis" }
  ]
};
