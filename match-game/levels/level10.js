/**
 * Level 10 Configuration: Hard Math Master (Hard Calculation Level)
 * Matching: Multi-operation Math -> Results (Order scrambled on right side)
 */
window.LEVEL_10_CONFIG = {
  title: "Level 10: Hard Math Master",
  subtitle: "Challenge your brain with mixed math operations",
  hintText: "Solve the hard equations in any order!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "h1", text: "15 - 7", name: "15 - 7", bgColor: "#fef2f2" },
    { id: "h2", text: "4 × 5", name: "4 × 5", bgColor: "#f0fdf4" },
    { id: "h3", text: "18 ÷ 3", name: "18 ÷ 3", bgColor: "#eff6ff" },
    { id: "h4", text: "9 + 8", name: "9 + 8", bgColor: "#fdf4ff" }
  ],
  rightItems: [
    { id: "h2", text: "20", name: "Result 20", bgColor: "#f0fdf4" },
    { id: "h3", text: "6", name: "Result 6", bgColor: "#eff6ff" },
    { id: "h4", text: "17", name: "Result 17", bgColor: "#fdf4ff" },
    { id: "h1", text: "8", name: "Result 8", bgColor: "#fef2f2" }
  ],
  matchingOrder: [
    { leftId: "h1", rightId: "h1" },
    { leftId: "h2", rightId: "h2" },
    { leftId: "h3", rightId: "h3" },
    { leftId: "h4", rightId: "h4" }
  ]
};
