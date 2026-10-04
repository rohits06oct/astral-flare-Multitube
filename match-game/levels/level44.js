/**
 * Level 44 Configuration: Hard Calculations - Century Challenge
 * Matching: Math Problem -> Solution (Order scrambled on right side)
 */
window.LEVEL_44_CONFIG = {
  title: "Level 44: Century Challenge",
  subtitle: "Match triple-digit equations with their exact answer",
  hintText: "Calculate century challenges!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "calc44_1", text: "16 × 8", name: "16 × 8", bgColor: "#fefce8" },
    { id: "calc44_2", text: "225 ÷ 5", name: "225 ÷ 5", bgColor: "#f0fdf4" },
    { id: "calc44_3", text: "230 - 85", name: "230 - 85", bgColor: "#eff6ff" }
  ],
  rightItems: [
    { id: "calc44_2", text: "45", name: "Result 45", bgColor: "#f0fdf4" },
    { id: "calc44_3", text: "145", name: "Result 145", bgColor: "#eff6ff" },
    { id: "calc44_1", text: "128", name: "Result 128", bgColor: "#fefce8" }
  ],
  matchingOrder: [
    { leftId: "calc44_1", rightId: "calc44_1" },
    { leftId: "calc44_2", rightId: "calc44_2" },
    { leftId: "calc44_3", rightId: "calc44_3" }
  ]
};
