/**
 * Level 46 Configuration: Hard Calculations - Products & Quotients
 * Matching: Math Problem -> Solution (Order scrambled on right side)
 */
window.LEVEL_46_CONFIG = {
  title: "Level 46: High Products",
  subtitle: "Match advanced multiplication and division problems",
  hintText: "Calculate products and quotients!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "calc46_1", text: "18 × 9", name: "18 × 9", bgColor: "#fef2f2" },
    { id: "calc46_2", text: "256 ÷ 8", name: "256 ÷ 8", bgColor: "#eff6ff" },
    { id: "calc46_3", text: "350 - 165", name: "350 - 165", bgColor: "#f0fdf4" }
  ],
  rightItems: [
    { id: "calc46_2", text: "32", name: "Result 32", bgColor: "#eff6ff" },
    { id: "calc46_3", text: "185", name: "Result 185", bgColor: "#f0fdf4" },
    { id: "calc46_1", text: "162", name: "Result 162", bgColor: "#fef2f2" }
  ],
  matchingOrder: [
    { leftId: "calc46_1", rightId: "calc46_1" },
    { leftId: "calc46_2", rightId: "calc46_2" },
    { leftId: "calc46_3", rightId: "calc46_3" }
  ]
};
