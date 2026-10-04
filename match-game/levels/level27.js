/**
 * Level 27 Configuration: Numbers Word to Digit (16 to 18)
 * Matching: Number Word -> Digit (Order scrambled on right side)
 */
window.LEVEL_27_CONFIG = {
  title: "Level 27: Numbers 16 to 18",
  subtitle: "Match each number word with its numeric digit",
  hintText: "Match number words to digits in any order!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "num16", text: "Sixteen", name: "Number Sixteen", bgColor: "#fff7ed" },
    { id: "num17", text: "Seventeen", name: "Number Seventeen", bgColor: "#f5f3ff" },
    { id: "num18", text: "Eighteen", name: "Number Eighteen", bgColor: "#fef3c7" }
  ],
  rightItems: [
    { id: "num17", text: "17", name: "Digit 17", bgColor: "#f5f3ff" },
    { id: "num18", text: "18", name: "Digit 18", bgColor: "#fef3c7" },
    { id: "num16", text: "16", name: "Digit 16", bgColor: "#fff7ed" }
  ],
  matchingOrder: [
    { leftId: "num16", rightId: "num16" },
    { leftId: "num17", rightId: "num17" },
    { leftId: "num18", rightId: "num18" }
  ]
};
