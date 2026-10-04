/**
 * Level 23 Configuration: Numbers Word to Digit (10 to 12)
 * Matching: Number Word -> Digit (Order scrambled on right side)
 */
window.LEVEL_23_CONFIG = {
  title: "Level 23: Numbers 10 to 12",
  subtitle: "Match each number word with its numeric digit",
  hintText: "Match number words to digits in any order!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "num10", text: "Ten", name: "Number Ten", bgColor: "#eff6ff" },
    { id: "num11", text: "Eleven", name: "Number Eleven", bgColor: "#f0fdf4" },
    { id: "num12", text: "Twelve", name: "Number Twelve", bgColor: "#fef3c7" }
  ],
  rightItems: [
    { id: "num11", text: "11", name: "Digit 11", bgColor: "#f0fdf4" },
    { id: "num12", text: "12", name: "Digit 12", bgColor: "#fef3c7" },
    { id: "num10", text: "10", name: "Digit 10", bgColor: "#eff6ff" }
  ],
  matchingOrder: [
    { leftId: "num10", rightId: "num10" },
    { leftId: "num11", rightId: "num11" },
    { leftId: "num12", rightId: "num12" }
  ]
};
