/**
 * Level 25 Configuration: Numbers Word to Digit (13 to 15)
 * Matching: Number Word -> Digit (Order scrambled on right side)
 */
window.LEVEL_25_CONFIG = {
  title: "Level 25: Numbers 13 to 15",
  subtitle: "Match each number word with its numeric digit",
  hintText: "Match number words to digits in any order!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "num13", text: "Thirteen", name: "Number Thirteen", bgColor: "#fdf4ff" },
    { id: "num14", text: "Fourteen", name: "Number Fourteen", bgColor: "#eff6ff" },
    { id: "num15", text: "Fifteen", name: "Number Fifteen", bgColor: "#f0fdf4" }
  ],
  rightItems: [
    { id: "num14", text: "14", name: "Digit 14", bgColor: "#eff6ff" },
    { id: "num15", text: "15", name: "Digit 15", bgColor: "#f0fdf4" },
    { id: "num13", text: "13", name: "Digit 13", bgColor: "#fdf4ff" }
  ],
  matchingOrder: [
    { leftId: "num13", rightId: "num13" },
    { leftId: "num14", rightId: "num14" },
    { leftId: "num15", rightId: "num15" }
  ]
};
