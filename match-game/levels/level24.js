/**
 * Level 24 Configuration: USA Eating Items - Diner Breakfast & Bakery
 * Matching: American Bakery and Breakfast Items (Order scrambled on right side)
 */
window.LEVEL_24_CONFIG = {
  title: "Level 24: USA Diner Treats",
  subtitle: "Match American pancakes, fresh apple pie, and donuts",
  hintText: "Match sweet diner treats in any order!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "pancake", image: "images/pancake.svg", name: "Stack of Pancakes", bgColor: "#fffbeb" },
    { id: "pie", image: "images/pie.svg", name: "Baked Apple Pie", bgColor: "#fff7ed" },
    { id: "donut", image: "images/donut.svg", name: "Glazed Donut", bgColor: "#fdf2f8" }
  ],
  rightItems: [
    { id: "pie", image: "images/pie.svg", name: "Baked Apple Pie", bgColor: "#fff7ed" },
    { id: "donut", image: "images/donut.svg", name: "Glazed Donut", bgColor: "#fdf2f8" },
    { id: "pancake", image: "images/pancake.svg", name: "Stack of Pancakes", bgColor: "#fffbeb" }
  ],
  matchingOrder: [
    { leftId: "pancake", rightId: "pancake" },
    { leftId: "pie", rightId: "pie" },
    { leftId: "donut", rightId: "donut" }
  ]
};
