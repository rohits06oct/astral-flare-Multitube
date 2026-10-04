/**
 * Level 22 Configuration: Majestic Birds - Aviary Wonders
 * Matching: Bird Species (Order scrambled on right side)
 */
window.LEVEL_22_CONFIG = {
  title: "Level 22: Majestic Birds",
  subtitle: "Match the bald eagle, tropical parrot, and wise owl",
  hintText: "Match the feathered birds in any order!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "eagle", image: "images/eagle.svg", name: "Bald Eagle", bgColor: "#fff7ed" },
    { id: "parrot", image: "images/parrot.svg", name: "Tropical Parrot", bgColor: "#f0fdf4" },
    { id: "owl", image: "images/owl.svg", name: "Wise Night Owl", bgColor: "#fefce8" }
  ],
  rightItems: [
    { id: "parrot", image: "images/parrot.svg", name: "Tropical Parrot", bgColor: "#f0fdf4" },
    { id: "owl", image: "images/owl.svg", name: "Wise Night Owl", bgColor: "#fefce8" },
    { id: "eagle", image: "images/eagle.svg", name: "Bald Eagle", bgColor: "#fff7ed" }
  ],
  matchingOrder: [
    { leftId: "eagle", rightId: "eagle" },
    { leftId: "parrot", rightId: "parrot" },
    { leftId: "owl", rightId: "owl" }
  ]
};
