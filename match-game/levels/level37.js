/**
 * Level 37 Configuration: Numbers Word to Digit (Hundreds)
 * Matching: Number Word -> Digit (Order scrambled on right side)
 */
window.LEVEL_37_CONFIG = {
  title: "Level 37: High Hundreds",
  subtitle: "Match each number word with its numeric digit",
  hintText: "Match number words to digits in any order!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "num200", text: "Two Hundred", name: "Number Two Hundred", bgColor: "#eff6ff" },
    { id: "num500", text: "Five Hundred", name: "Number Five Hundred", bgColor: "#f0fdf4" },
    { id: "num900", text: "Nine Hundred", name: "Number Nine Hundred", bgColor: "#fefce8" }
  ],
  rightItems: [
    { id: "num500", text: "500", name: "Digit 500", bgColor: "#f0fdf4" },
    { id: "num900", text: "900", name: "Digit 900", bgColor: "#fefce8" },
    { id: "num200", text: "200", name: "Digit 200", bgColor: "#eff6ff" }
  ],
  matchingOrder: [
    { leftId: "num200", rightId: "num200" },
    { leftId: "num500", rightId: "num500" },
    { leftId: "num900", rightId: "num900" }
  ]
};
