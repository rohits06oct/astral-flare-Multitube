/**
 * Level 29 Configuration: Numbers Word to Digit (19 to 21)
 * Matching: Number Word -> Digit (Order scrambled on right side)
 */
window.LEVEL_29_CONFIG = {
  title: "Level 29: Numbers 19 to 21",
  subtitle: "Match each number word with its numeric digit",
  hintText: "Match number words to digits in any order!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "num19", text: "Nineteen", name: "Number Nineteen", bgColor: "#eff6ff" },
    { id: "num20", text: "Twenty", name: "Number Twenty", bgColor: "#f0fdf4" },
    { id: "num21", text: "Twenty-One", name: "Number Twenty-One", bgColor: "#fefce8" }
  ],
  rightItems: [
    { id: "num20", text: "20", name: "Digit 20", bgColor: "#f0fdf4" },
    { id: "num21", text: "21", name: "Digit 21", bgColor: "#fefce8" },
    { id: "num19", text: "19", name: "Digit 19", bgColor: "#eff6ff" }
  ],
  matchingOrder: [
    { leftId: "num19", rightId: "num19" },
    { leftId: "num20", rightId: "num20" },
    { leftId: "num21", rightId: "num21" }
  ]
};
