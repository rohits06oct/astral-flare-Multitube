/**
 * Level 42 Configuration: Hard Calculations - Double Step Math
 * Matching: Math Problem -> Solution (Order scrambled on right side)
 */
window.LEVEL_42_CONFIG = {
  title: "Level 42: Double Step Math",
  subtitle: "Match triple equations with their accurate result",
  hintText: "Calculate each equation carefully!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "calc42_1", text: "15 × 7", name: "15 × 7", bgColor: "#f0fdf4" },
    { id: "calc42_2", text: "144 ÷ 6", name: "144 ÷ 6", bgColor: "#eff6ff" },
    { id: "calc42_3", text: "180 - 65", name: "180 - 65", bgColor: "#fefce8" }
  ],
  rightItems: [
    { id: "calc42_2", text: "24", name: "Result 24", bgColor: "#eff6ff" },
    { id: "calc42_3", text: "115", name: "Result 115", bgColor: "#fefce8" },
    { id: "calc42_1", text: "105", name: "Result 105", bgColor: "#f0fdf4" }
  ],
  matchingOrder: [
    { leftId: "calc42_1", rightId: "calc42_1" },
    { leftId: "calc42_2", rightId: "calc42_2" },
    { leftId: "calc42_3", rightId: "calc42_3" }
  ]
};
