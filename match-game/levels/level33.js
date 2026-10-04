/**
 * Level 33 Configuration: Big Tens Numbers Word to Digit (60 to 80)
 * Matching: Big Tens Words -> Numeric Digits (Order scrambled on right side)
 */
window.LEVEL_33_CONFIG = {
  title: "Level 33: Numbers 60 to 80",
  subtitle: "Match higher round number words with numeric digits",
  hintText: "Match big numbers in any order!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "num60", text: "Sixty", name: "Number Sixty", bgColor: "#fef3c7" },
    { id: "num70", text: "Seventy", name: "Number Seventy", bgColor: "#eff6ff" },
    { id: "num80", text: "Eighty", name: "Number Eighty", bgColor: "#fdf2f8" }
  ],
  rightItems: [
    { id: "num70", text: "70", name: "Digit 70", bgColor: "#eff6ff" },
    { id: "num80", text: "80", name: "Digit 80", bgColor: "#fdf2f8" },
    { id: "num60", text: "60", name: "Digit 60", bgColor: "#fef3c7" }
  ],
  matchingOrder: [
    { leftId: "num60", rightId: "num60" },
    { leftId: "num70", rightId: "num70" },
    { leftId: "num80", rightId: "num80" }
  ]
};
