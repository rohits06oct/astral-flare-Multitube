/**
 * Level 36 Configuration: Grand American & Nature Finale
 * Matching: Bald Eagle, Desert Camel, Classic Burger (Order scrambled on right side)
 */
window.LEVEL_36_CONFIG = {
  title: "Level 36: Grand Finale",
  subtitle: "Master the grand combination of birds, camel, and USA food!",
  hintText: "Complete the ultimate level in any order!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "eagle_fin", image: "images/eagle.svg", name: "American Bald Eagle", bgColor: "#fff7ed" },
    { id: "camel_fin", image: "images/camel.svg", name: "Desert Camel", bgColor: "#fef3c7" },
    { id: "burger_fin", image: "images/burger.svg", name: "All-American Burger", bgColor: "#fef2f2" }
  ],
  rightItems: [
    { id: "camel_fin", image: "images/camel.svg", name: "Desert Camel", bgColor: "#fef3c7" },
    { id: "burger_fin", image: "images/burger.svg", name: "All-American Burger", bgColor: "#fef2f2" },
    { id: "eagle_fin", image: "images/eagle.svg", name: "American Bald Eagle", bgColor: "#fff7ed" }
  ],
  matchingOrder: [
    { leftId: "eagle_fin", rightId: "eagle_fin" },
    { leftId: "camel_fin", rightId: "camel_fin" },
    { leftId: "burger_fin", rightId: "burger_fin" }
  ]
};
