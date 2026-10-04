/**
 * Level 48 Configuration: Hard Calculations - Lightning Challenge
 * Matching: Math Problem -> Solution (Order scrambled on right side)
 */
window.LEVEL_48_CONFIG = {
  title: "Level 48: Lightning Math",
  subtitle: "Match fast-paced arithmetic challenges",
  hintText: "Solve lightning math challenges!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "calc48_1", text: "24 × 5", name: "24 × 5", bgColor: "#fff7ed" },
    { id: "calc48_2", text: "320 ÷ 4", name: "320 ÷ 4", bgColor: "#eff6ff" },
    { id: "calc48_3", text: "410 - 175", name: "410 - 175", bgColor: "#fefce8" }
  ],
  rightItems: [
    { id: "calc48_2", text: "80", name: "Result 80", bgColor: "#eff6ff" },
    { id: "calc48_3", text: "235", name: "Result 235", bgColor: "#fefce8" },
    { id: "calc48_1", text: "120", name: "Result 120", bgColor: "#fff7ed" }
  ],
  matchingOrder: [
    { leftId: "calc48_1", rightId: "calc48_1" },
    { leftId: "calc48_2", rightId: "calc48_2" },
    { leftId: "calc48_3", rightId: "calc48_3" }
  ]
};
