/**
 * Level 24 Configuration: USA Eating Items - American Bakery & Breakfast
 * Matching: Word Name on Left -> Object Image on Right
 */
window.LEVEL_24_CONFIG = {
  title: "Level 24: USA Sweet Treats",
  subtitle: "Match treat names with their pictures",
  hintText: "Match sweet treat names to their pictures!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "pancake", text: "Pancakes", name: "Pancakes", bgColor: "#fffbeb" },
    { id: "pie", text: "Apple Pie", name: "Apple Pie", bgColor: "#fff7ed" },
    { id: "donut", text: "Donut", name: "Donut", bgColor: "#fdf2f8" }
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
