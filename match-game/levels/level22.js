/**
 * Level 22 Configuration: Birds of the Sky & Tropics
 * Matching: Word Name on Left -> Object Image on Right
 */
window.LEVEL_22_CONFIG = {
  title: "Level 22: Majestic Birds",
  subtitle: "Match bird names with their pictures",
  hintText: "Match bird names to their pictures!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "eagle", text: "Eagle", name: "Eagle", bgColor: "#fff7ed" },
    { id: "parrot", text: "Parrot", name: "Parrot", bgColor: "#f0fdf4" },
    { id: "owl", text: "Owl", name: "Owl", bgColor: "#fef3c7" }
  ],
  rightItems: [
    { id: "parrot", image: "images/parrot.svg", name: "Tropical Parrot", bgColor: "#f0fdf4" },
    { id: "owl", image: "images/owl.svg", name: "Wise Owl", bgColor: "#fef3c7" },
    { id: "eagle", image: "images/eagle.svg", name: "Bald Eagle", bgColor: "#fff7ed" }
  ],
  matchingOrder: [
    { leftId: "eagle", rightId: "eagle" },
    { leftId: "parrot", rightId: "parrot" },
    { leftId: "owl", rightId: "owl" }
  ]
};
