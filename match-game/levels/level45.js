/**
 * Level 45 Configuration: Numbers Word to Digit (Big Numbers)
 * Matching: Number Word -> Digit (Order scrambled on right side)
 */
window.LEVEL_45_CONFIG = {
  title: "Level 45: Big Numbers",
  subtitle: "Match massive number words with their numeric digits",
  hintText: "Match high number words to digits!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "num20k", text: "Twenty Thousand", name: "Twenty Thousand", bgColor: "#eff6ff" },
    { id: "num50k", text: "Fifty Thousand", name: "Fifty Thousand", bgColor: "#f0fdf4" },
    { id: "num1m", text: "One Million", name: "One Million", bgColor: "#fdf4ff" }
  ],
  rightItems: [
    { id: "num50k", text: "50000", name: "Digit 50000", bgColor: "#f0fdf4" },
    { id: "num1m", text: "1000000", name: "Digit 1000000", bgColor: "#fdf4ff" },
    { id: "num20k", text: "20000", name: "Digit 20000", bgColor: "#eff6ff" }
  ],
  matchingOrder: [
    { leftId: "num20k", rightId: "num20k" },
    { leftId: "num50k", rightId: "num50k" },
    { leftId: "num1m", rightId: "num1m" }
  ]
};
