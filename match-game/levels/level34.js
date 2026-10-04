/**
 * Level 34 Configuration: USA Eating Items - Diner & Grill Classics
 * Matching: Word Name on Left -> Object Image on Right
 */
window.LEVEL_34_CONFIG = {
  title: "Level 34: USA Diner Classics",
  subtitle: "Match diner food names with their pictures",
  hintText: "Match food names to their pictures!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "steak", text: "Steak", name: "Steak", bgColor: "#fff7ed" },
    { id: "corn", text: "Corn", name: "Corn", bgColor: "#fefce8" },
    { id: "fries2", text: "Fries", name: "Fries", bgColor: "#fffbeb" }
  ],
  rightItems: [
    { id: "corn", image: "images/corn.svg", name: "Golden Corn Cob", bgColor: "#fefce8" },
    { id: "fries2", image: "images/fries.svg", name: "Golden Fries", bgColor: "#fffbeb" },
    { id: "steak", image: "images/steak.svg", name: "Grilled BBQ Steak", bgColor: "#fff7ed" }
  ],
  matchingOrder: [
    { leftId: "steak", rightId: "steak" },
    { leftId: "corn", rightId: "corn" },
    { leftId: "fries2", rightId: "fries2" }
  ]
};
