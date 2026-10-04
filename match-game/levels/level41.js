/**
 * Level 41 Configuration: Numbers Word to Digit (Thousands)
 * Matching: Number Word -> Digit (Order scrambled on right side)
 */
window.LEVEL_41_CONFIG = {
  title: "Level 41: Thousands",
  subtitle: "Match thousand number words with their numeric digits",
  hintText: "Match number words to digits in any order!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "num2k", text: "Two Thousand", name: "Two Thousand", bgColor: "#eff6ff" },
    { id: "num5k", text: "Five Thousand", name: "Five Thousand", bgColor: "#f0fdf4" },
    { id: "num10k", text: "Ten Thousand", name: "Ten Thousand", bgColor: "#fff7ed" }
  ],
  rightItems: [
    { id: "num5k", text: "5000", name: "Digit 5000", bgColor: "#f0fdf4" },
    { id: "num10k", text: "10000", name: "Digit 10000", bgColor: "#fff7ed" },
    { id: "num2k", text: "2000", name: "Digit 2000", bgColor: "#eff6ff" }
  ],
  matchingOrder: [
    { leftId: "num2k", rightId: "num2k" },
    { leftId: "num5k", rightId: "num5k" },
    { leftId: "num10k", rightId: "num10k" }
  ]
};
