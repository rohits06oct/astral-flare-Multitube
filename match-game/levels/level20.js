/**
 * Level 20 Configuration: Desert Camel & Oasis
 * Matching: Word Name on Left -> Object Image on Right
 */
window.LEVEL_20_CONFIG = {
  title: "Level 20: Desert Camel & Oasis",
  subtitle: "Match desert words with their pictures",
  hintText: "Match desert words to their pictures!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "camel", text: "Camel", name: "Camel", bgColor: "#fef3c7" },
    { id: "cactus", text: "Cactus", name: "Cactus", bgColor: "#f0fdf4" },
    { id: "oasis", text: "Oasis", name: "Oasis", bgColor: "#eff6ff" }
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
