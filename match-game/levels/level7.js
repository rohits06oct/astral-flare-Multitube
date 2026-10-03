/**
 * Level 7 Configuration: Alphabet J, K, L
 * Matching: Letter -> Object (Order scrambled on right side)
 */
window.LEVEL_7_CONFIG = {
  title: "Level 7: Alphabet J, K, L",
  subtitle: "Match each alphabet letter with the correct image",
  hintText: "Match letters to items in any order!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "J", text: "J", name: "Letter J", bgColor: "#eff6ff" },
    { id: "K", text: "K", name: "Letter K", bgColor: "#f0fdf4" },
    { id: "L", text: "L", name: "Letter L", bgColor: "#fefce8" }
  ],
  rightItems: [
    { id: "K", image: "images/kite.svg", name: "Kite", bgColor: "#f0fdf4" },
    { id: "L", image: "images/lion.svg", name: "Lion", bgColor: "#fefce8" },
    { id: "J", image: "images/juice.svg", name: "Juice", bgColor: "#eff6ff" }
  ],
  matchingOrder: [
    { leftId: "J", rightId: "J" },
    { leftId: "K", rightId: "K" },
    { leftId: "L", rightId: "L" }
  ]
};
