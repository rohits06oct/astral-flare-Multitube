/**
 * Level 40 Configuration: Hard Calculations - Power Math
 * Matching: Math Problem -> Solution (Order scrambled on right side)
 */
window.LEVEL_40_CONFIG = {
  title: "Level 40: Power Math",
  subtitle: "Match hard math challenges with their correct answer",
  hintText: "Solve the hard calculations!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "calc40_1", text: "14 × 6", name: "14 × 6", bgColor: "#fef3c7" },
    { id: "calc40_2", text: "96 ÷ 4", name: "96 ÷ 4", bgColor: "#eff6ff" },
    { id: "calc40_3", text: "125 - 47", name: "125 - 47", bgColor: "#fdf2f8" }
  ],
  rightItems: [
    { id: "calc40_2", text: "24", name: "Result 24", bgColor: "#eff6ff" },
    { id: "calc40_3", text: "78", name: "Result 78", bgColor: "#fdf2f8" },
    { id: "calc40_1", text: "84", name: "Result 84", bgColor: "#fef3c7" }
  ],
  matchingOrder: [
    { leftId: "calc40_1", rightId: "calc40_1" },
    { leftId: "calc40_2", rightId: "calc40_2" },
    { leftId: "calc40_3", rightId: "calc40_3" }
  ]
};
