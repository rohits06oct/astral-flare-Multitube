/**
 * Level 19 Configuration: Numbers Word to Digit (4 to 6)
 * Matching: Number Word -> Digit (Order scrambled on right side)
 */
window.LEVEL_19_CONFIG = {
  title: "Level 19: Numbers 4 to 6",
  subtitle: "Match each number word with its numeric digit",
  hintText: "Match number words to digits in any order!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "num4", text: "Four", name: "Number Four", bgColor: "#f0fdf4" },
    { id: "num5", text: "Five", name: "Number Five", bgColor: "#eff6ff" },
    { id: "num6", text: "Six", name: "Number Six", bgColor: "#fdf4ff" }
  ],
  rightItems: [
    { id: "num5", text: "5", name: "Digit 5", bgColor: "#eff6ff" },
    { id: "num6", text: "6", name: "Digit 6", bgColor: "#fdf4ff" },
    { id: "num4", text: "4", name: "Digit 4", bgColor: "#f0fdf4" }
  ],
  matchingOrder: [
    { leftId: "num4", rightId: "num4" },
    { leftId: "num5", rightId: "num5" },
    { leftId: "num6", rightId: "num6" }
  ]
};
