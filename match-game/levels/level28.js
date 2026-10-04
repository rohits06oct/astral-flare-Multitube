/**
 * Level 28 Configuration: USA Eating Items - Cinema & Boardwalk Treats
 * Matching: Popcorn, Milkshake, and Pizza (Order scrambled on right side)
 */
window.LEVEL_28_CONFIG = {
  title: "Level 28: Cinema & Boardwalk Treats",
  subtitle: "Match American movie popcorn, sweet milkshake, and pizza",
  hintText: "Match boardwalk favorites in any order!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "popcorn", image: "images/popcorn.svg", name: "Movie Popcorn", bgColor: "#fefce8" },
    { id: "milkshake", image: "images/milkshake.svg", name: "Strawberry Milkshake", bgColor: "#fdf2f8" },
    { id: "pizza", image: "images/pizza.svg", name: "Pepperoni Pizza", bgColor: "#fff7ed" }
  ],
  rightItems: [
    { id: "milkshake", image: "images/milkshake.svg", name: "Strawberry Milkshake", bgColor: "#fdf2f8" },
    { id: "pizza", image: "images/pizza.svg", name: "Pepperoni Pizza", bgColor: "#fff7ed" },
    { id: "popcorn", image: "images/popcorn.svg", name: "Movie Popcorn", bgColor: "#fefce8" }
  ],
  matchingOrder: [
    { leftId: "popcorn", rightId: "popcorn" },
    { leftId: "milkshake", rightId: "milkshake" },
    { leftId: "pizza", rightId: "pizza" }
  ]
};
