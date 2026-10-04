/**
 * Level 38 Configuration: Quick Math Calculations
 * Matching: Math Problem -> Solution (Order scrambled on right side)
 */
window.LEVEL_38_CONFIG = {
  title: "Level 38: Math Calculations",
  subtitle: "Match each math equation with its correct answer",
  hintText: "Calculate and connect in any order!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "calc38_1", text: "24 + 18", name: "24 + 18", bgColor: "#eff6ff" },
    { id: "calc38_2", text: "75 - 28", name: "75 - 28", bgColor: "#f0fdf4" },
    { id: "calc38_3", text: "7 × 8", name: "7 × 8", bgColor: "#fefce8" }
  ],
  rightItems: [
    { id: "calc38_2", text: "47", name: "Result 47", bgColor: "#f0fdf4" },
    { id: "calc38_3", text: "56", name: "Result 56", bgColor: "#fefce8" },
    { id: "calc38_1", text: "42", name: "Result 42", bgColor: "#eff6ff" }
  ],
  matchingOrder: [
    { leftId: "calc38_1", rightId: "calc38_1" },
    { leftId: "calc38_2", rightId: "calc38_2" },
    { leftId: "calc38_3", rightId: "calc38_3" }
  ]
};
