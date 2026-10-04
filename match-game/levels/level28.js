/**
 * Level 28 Configuration: USA Eating Items - Cinema & Snack Treats
 * Matching: Word Name on Left -> Object Image on Right
 */
window.LEVEL_28_CONFIG = {
  title: "Level 28: USA Snacks & Drinks",
  subtitle: "Match USA snack names with their pictures",
  hintText: "Match snack names to their pictures!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "popcorn", text: "Popcorn", name: "Popcorn", bgColor: "#fefce8" },
    { id: "milkshake", text: "Milkshake", name: "Milkshake", bgColor: "#fdf2f8" },
    { id: "pizza", text: "Pizza", name: "Pizza", bgColor: "#fff7ed" }
  ],
  rightItems: [
    { id: "milkshake", image: "images/milkshake.svg", name: "Strawberry Milkshake", bgColor: "#fdf2f8" },
    { id: "pizza", image: "images/pizza.svg", name: "NY Style Pizza", bgColor: "#fff7ed" },
    { id: "popcorn", image: "images/popcorn.svg", name: "Movie Popcorn", bgColor: "#fefce8" }
  ],
  matchingOrder: [
    { leftId: "popcorn", rightId: "popcorn" },
    { leftId: "milkshake", rightId: "milkshake" },
    { leftId: "pizza", rightId: "pizza" }
  ]
};
