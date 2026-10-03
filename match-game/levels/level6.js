/**
 * Level 6 Configuration: Math Multipliers (Calculation Level)
 * Matching: Multiplication & Division -> Result (Order scrambled on right side)
 */
window.LEVEL_6_CONFIG = {
  title: "Level 6: Math Multipliers",
  subtitle: "Match each multiplication & division with its product",
  hintText: "Calculate and connect in any order!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "m1", text: "3 × 3", name: "3 × 3", bgColor: "#fefce8" },
    { id: "m2", text: "12 ÷ 2", name: "12 ÷ 2", bgColor: "#ecfdf5" },
    { id: "m3", text: "5 × 2", name: "5 × 2", bgColor: "#fff1f2" }
  ],
  rightItems: [
    { id: "m2", text: "6", name: "Result 6", bgColor: "#ecfdf5" },
    { id: "m3", text: "10", name: "Result 10", bgColor: "#fff1f2" },
    { id: "m1", text: "9", name: "Result 9", bgColor: "#fefce8" }
  ],
  matchingOrder: [
    { leftId: "m1", rightId: "m1" },
    { leftId: "m2", rightId: "m2" },
    { leftId: "m3", rightId: "m3" }
  ]
};
