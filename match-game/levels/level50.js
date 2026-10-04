/**
 * Level 50 Configuration: Grand Finale - Master Calculations
 * Matching: Math Problem -> Solution (Order scrambled on right side)
 */
window.LEVEL_50_CONFIG = {
  title: "Level 50: Grand Finale",
  subtitle: "Match the ultimate grand master calculations",
  hintText: "Conquer the grand finale math equations!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "calc50_1", text: "25 × 12", name: "25 × 12", bgColor: "#fef3c7" },
    { id: "calc50_2", text: "480 ÷ 15", name: "480 ÷ 15", bgColor: "#eff6ff" },
    { id: "calc50_3", text: "625 + 375", name: "625 + 375", bgColor: "#f0fdf4" }
  ],
  rightItems: [
    { id: "calc50_2", text: "32", name: "Result 32", bgColor: "#eff6ff" },
    { id: "calc50_3", text: "1000", name: "Result 1000", bgColor: "#f0fdf4" },
    { id: "calc50_1", text: "300", name: "Result 300", bgColor: "#fef3c7" }
  ],
  matchingOrder: [
    { leftId: "calc50_1", rightId: "calc50_1" },
    { leftId: "calc50_2", rightId: "calc50_2" },
    { leftId: "calc50_3", rightId: "calc50_3" }
  ]
};
