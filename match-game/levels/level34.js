/**
 * Level 34 Configuration: USA Eating Items - American BBQ & Harvest
 * Matching: Grilled Steak, Corn on Cob, and Fries (Order scrambled on right side)
 */
window.LEVEL_34_CONFIG = {
  title: "Level 34: USA BBQ Feast",
  subtitle: "Match American grilled steak, sweet corn, and french fries",
  hintText: "Savor and match BBQ items in any order!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "steak", image: "images/steak.svg", name: "Grilled BBQ Steak", bgColor: "#fff7ed" },
    { id: "corn", image: "images/corn.svg", name: "Golden Corn Cob", bgColor: "#fefce8" },
    { id: "fries2", image: "images/fries.svg", name: "Crispy Fries", bgColor: "#fef2f2" }
  ],
  rightItems: [
    { id: "corn", image: "images/corn.svg", name: "Golden Corn Cob", bgColor: "#fefce8" },
    { id: "fries2", image: "images/fries.svg", name: "Crispy Fries", bgColor: "#fef2f2" },
    { id: "steak", image: "images/steak.svg", name: "Grilled BBQ Steak", bgColor: "#fff7ed" }
  ],
  matchingOrder: [
    { leftId: "steak", rightId: "steak" },
    { leftId: "corn", rightId: "corn" },
    { leftId: "fries2", rightId: "fries2" }
  ]
};
