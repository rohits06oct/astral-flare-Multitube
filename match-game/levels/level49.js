/**
 * Level 49 Configuration: Hard Calculations - Master Brain Teaser
 * Matching: Math Problem -> Solution (Order scrambled on right side)
 */
window.LEVEL_49_CONFIG = {
  title: "Level 49: Brain Teasers",
  subtitle: "Match sharp mental arithmetic puzzles",
  hintText: "Solve the brain teaser equations!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "calc49_1", text: "19 × 7", name: "19 × 7", bgColor: "#fdf2f8" },
    { id: "calc49_2", text: "396 ÷ 6", name: "396 ÷ 6", bgColor: "#eff6ff" },
    { id: "calc49_3", text: "500 - 245", name: "500 - 245", bgColor: "#f0fdf4" }
  ],
  rightItems: [
    { id: "calc49_2", text: "66", name: "Result 66", bgColor: "#eff6ff" },
    { id: "calc49_3", text: "255", name: "Result 255", bgColor: "#f0fdf4" },
    { id: "calc49_1", text: "133", name: "Result 133", bgColor: "#fdf2f8" }
  ],
  matchingOrder: [
    { leftId: "calc49_1", rightId: "calc49_1" },
    { leftId: "calc49_2", rightId: "calc49_2" },
    { leftId: "calc49_3", rightId: "calc49_3" }
  ]
};
