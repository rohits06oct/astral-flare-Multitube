/**
 * Level 17 Configuration: Numbers Word to Digit (1 to 3)
 * Matching: Number Word -> Digit (Order scrambled on right side)
 */
window.LEVEL_17_CONFIG = {
  title: "Level 17: Numbers 1 to 3",
  subtitle: "Match each number word with its numeric digit",
  hintText: "Match number words to digits in any order!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "num1", text: "One", name: "Number One", bgColor: "#eff6ff" },
    { id: "num2", text: "Two", name: "Number Two", bgColor: "#fefce8" },
    { id: "num3", text: "Three", name: "Number Three", bgColor: "#fef2f2" }
  ],
  rightItems: [
    { id: "num2", text: "2", name: "Digit 2", bgColor: "#fefce8" },
    { id: "num3", text: "3", name: "Digit 3", bgColor: "#fef2f2" },
    { id: "num1", text: "1", name: "Digit 1", bgColor: "#eff6ff" }
  ],
  matchingOrder: [
    { leftId: "num1", rightId: "num1" },
    { leftId: "num2", rightId: "num2" },
    { leftId: "num3", rightId: "num3" }
  ]
};
