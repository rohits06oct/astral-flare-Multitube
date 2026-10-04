/**
 * Level 36 Configuration: Grand Finale - Objects & Wildlife Trio
 * Matching: Word Name on Left -> Object Image on Right
 */
window.LEVEL_36_CONFIG = {
  title: "Level 36: Grand Finale",
  subtitle: "Match the words with their pictures",
  hintText: "Match each word to its picture!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "eagle_fin", text: "Eagle", name: "Eagle", bgColor: "#fff7ed" },
    { id: "camel_fin", text: "Camel", name: "Camel", bgColor: "#fef3c7" },
    { id: "burger_fin", text: "Burger", name: "Burger", bgColor: "#fef2f2" }
  ],
  rightItems: [
    { id: "camel_fin", image: "images/camel.svg", name: "Desert Camel", bgColor: "#fef3c7" },
    { id: "burger_fin", image: "images/burger.svg", name: "American Burger", bgColor: "#fef2f2" },
    { id: "eagle_fin", image: "images/eagle.svg", name: "American Bald Eagle", bgColor: "#fff7ed" }
  ],
  matchingOrder: [
    { leftId: "eagle_fin", rightId: "eagle_fin" },
    { leftId: "camel_fin", rightId: "camel_fin" },
    { leftId: "burger_fin", rightId: "burger_fin" }
  ]
};
