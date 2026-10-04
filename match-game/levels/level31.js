/**
 * Level 31 Configuration: Tens Numbers Word to Digit (30 to 50)
 * Matching: Tens Words -> Numeric Digits (Order scrambled on right side)
 */
window.LEVEL_31_CONFIG = {
  title: "Level 31: Numbers 30 to 50",
  subtitle: "Match round number words with their numeric digits",
  hintText: "Match tens numbers in any order!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "num30", text: "Thirty", name: "Number Thirty", bgColor: "#fff7ed" },
    { id: "num40", text: "Forty", name: "Number Forty", bgColor: "#f5f3ff" },
    { id: "num50", text: "Fifty", name: "Number Fifty", bgColor: "#f0fdf4" }
  ],
  rightItems: [
    { id: "num40", text: "40", name: "Digit 40", bgColor: "#f5f3ff" },
    { id: "num50", text: "50", name: "Digit 50", bgColor: "#f0fdf4" },
    { id: "num30", text: "30", name: "Digit 30", bgColor: "#fff7ed" }
  ],
  matchingOrder: [
    { leftId: "num30", rightId: "num30" },
    { leftId: "num40", rightId: "num40" },
    { leftId: "num50", rightId: "num50" }
  ]
};
