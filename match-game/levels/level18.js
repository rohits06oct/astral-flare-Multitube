/**
 * Level 18 Configuration: USA Eating Items - Fast Food Classics
 * Matching: Classic American Foods (Order scrambled on right side)
 */
window.LEVEL_18_CONFIG = {
  title: "Level 18: USA Fast Food",
  subtitle: "Match delicious iconic American fast food items",
  hintText: "Match yummy USA foods in any order!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "burger", image: "images/burger.svg", name: "American Burger", bgColor: "#fff7ed" },
    { id: "hotdog", image: "images/hotdog.svg", name: "Classic Hot Dog", bgColor: "#fef2f2" },
    { id: "fries", image: "images/fries.svg", name: "Crispy French Fries", bgColor: "#fefce8" }
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
