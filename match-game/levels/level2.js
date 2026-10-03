/**
 * Level 2 Configuration: Quick Math Calculation (Calculation Level)
 * Matching: Math Problem -> Solution (Order scrambled on right side)
 */
window.LEVEL_2_CONFIG = {
  title: "Level 2: Quick Math Calculation",
  subtitle: "Match each math equation with its correct answer",
  hintText: "Calculate and connect in any order!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "calc1", text: "2 + 3", name: "2 + 3", bgColor: "#f0fdf4" },
    { id: "calc2", text: "7 - 3", name: "7 - 3", bgColor: "#eff6ff" },
    { id: "calc3", text: "4 + 4", name: "4 + 4", bgColor: "#fdf4ff" }
  ],
  rightItems: [
    { id: "calc2", text: "4", name: "Result 4", bgColor: "#eff6ff" },
    { id: "calc3", text: "8", name: "Result 8", bgColor: "#fdf4ff" },
    { id: "calc1", text: "5", name: "Result 5", bgColor: "#f0fdf4" }
  ],
  matchingOrder: [
    { leftId: "calc1", rightId: "calc1" },
    { leftId: "calc2", rightId: "calc2" },
    { leftId: "calc3", rightId: "calc3" }
  ]
};
