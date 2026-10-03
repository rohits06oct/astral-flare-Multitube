/**
 * Level 13 Configuration: Alphabet S, T, U
 * Matching: Letter -> Object (Order scrambled on right side)
 */
window.LEVEL_13_CONFIG = {
  title: "Level 13: Alphabet S, T, U",
  subtitle: "Match each alphabet letter with the correct image",
  hintText: "Match letters to items in any order!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "S", text: "S", name: "Letter S", bgColor: "#fefce8" },
    { id: "T", text: "T", name: "Letter T", bgColor: "#f0fdf4" },
    { id: "U", text: "U", name: "Letter U", bgColor: "#eff6ff" }
  ],
  rightItems: [
    { id: "T", image: "images/tree.svg", name: "Tree", bgColor: "#f0fdf4" },
    { id: "U", image: "images/umbrella.svg", name: "Umbrella", bgColor: "#eff6ff" },
    { id: "S", image: "images/sun.svg", name: "Sun", bgColor: "#fefce8" }
  ],
  matchingOrder: [
    { leftId: "S", rightId: "S" },
    { leftId: "T", rightId: "T" },
    { leftId: "U", rightId: "U" }
  ]
};
