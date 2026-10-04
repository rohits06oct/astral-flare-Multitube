/**
 * Level 18 Configuration: USA Eating Items - Fast Food Classics
 * Matching: Word Name on Left -> Object Image on Right
 */
window.LEVEL_18_CONFIG = {
  title: "Level 18: USA Fast Food",
  subtitle: "Match food words with their pictures",
  hintText: "Match food words to their pictures!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "burger", text: "Burger", name: "Burger", bgColor: "#fff7ed" },
    { id: "hotdog", text: "Hot Dog", name: "Hot Dog", bgColor: "#fef2f2" },
    { id: "fries", text: "Fries", name: "Fries", bgColor: "#fefce8" }
  ],
  rightItems: [
    { id: "hotdog", image: "images/hotdog.svg", name: "Classic Hot Dog", bgColor: "#fef2f2" },
    { id: "fries", image: "images/fries.svg", name: "Crispy French Fries", bgColor: "#fefce8" },
    { id: "burger", image: "images/burger.svg", name: "American Burger", bgColor: "#fff7ed" }
  ],
  matchingOrder: [
    { leftId: "burger", rightId: "burger" },
    { leftId: "hotdog", rightId: "hotdog" },
    { leftId: "fries", rightId: "fries" }
  ]
};
