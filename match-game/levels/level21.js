/**
 * Level 21 Configuration: Numbers Word to Digit (7 to 9)
 * Matching: Number Word -> Digit (Order scrambled on right side)
 */
window.LEVEL_21_CONFIG = {
  title: "Level 21: Numbers 7 to 9",
  subtitle: "Match each number word with its numeric digit",
  hintText: "Match number words to digits in any order!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "num7", text: "Seven", name: "Number Seven", bgColor: "#fff7ed" },
    { id: "num8", text: "Eight", name: "Number Eight", bgColor: "#f5f3ff" },
    { id: "num9", text: "Nine", name: "Number Nine", bgColor: "#ecfeff" }
  ],
  rightItems: [
    { id: "num8", text: "8", name: "Digit 8", bgColor: "#f5f3ff" },
    { id: "num9", text: "9", name: "Digit 9", bgColor: "#ecfeff" },
    { id: "num7", text: "7", name: "Digit 7", bgColor: "#fff7ed" }
  ],
  matchingOrder: [
    { leftId: "num7", rightId: "num7" },
    { leftId: "num8", rightId: "num8" },
    { leftId: "num9", rightId: "num9" }
  ]
};
