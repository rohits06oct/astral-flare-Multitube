/**
 * Level 35 Configuration: Century Numbers Word to Digit (90, 100, 1000)
 * Matching: Large Number Words -> Numeric Digits (Order scrambled on right side)
 */
window.LEVEL_35_CONFIG = {
  title: "Level 35: Giant Numbers",
  subtitle: "Match large number words with their numeric digits",
  hintText: "Match giant numbers in any order!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "num90", text: "Ninety", name: "Number Ninety", bgColor: "#fff7ed" },
    { id: "num100", text: "One Hundred", name: "Number One Hundred", bgColor: "#eff6ff" },
    { id: "num1000", text: "One Thousand", name: "Number One Thousand", bgColor: "#f0fdf4" }
  ],
  rightItems: [
    { id: "num100", text: "100", name: "Digit 100", bgColor: "#eff6ff" },
    { id: "num1000", text: "1000", name: "Digit 1000", bgColor: "#f0fdf4" },
    { id: "num90", text: "90", name: "Digit 90", bgColor: "#fff7ed" }
  ],
  matchingOrder: [
    { leftId: "num90", rightId: "num90" },
    { leftId: "num100", rightId: "num100" },
    { leftId: "num1000", rightId: "num1000" }
  ]
};
