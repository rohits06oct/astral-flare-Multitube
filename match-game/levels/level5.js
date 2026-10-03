/**
 * Level 5 Configuration: Alphabet G, H, I
 * Matching: Letter -> Object (Order scrambled on right side)
 */
window.LEVEL_5_CONFIG = {
  title: "Level 5: Alphabet G, H, I",
  subtitle: "Match each alphabet letter with the correct image",
  hintText: "Match letters to items in any order!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "G", text: "G", name: "Letter G", bgColor: "#f5f3ff" },
    { id: "H", text: "H", name: "Letter H", bgColor: "#fdf2f8" },
    { id: "I", text: "I", name: "Letter I", bgColor: "#ecfeff" }
  ],
  rightItems: [
    { id: "H", image: "images/hat.svg", name: "Hat", bgColor: "#fdf2f8" },
    { id: "I", image: "images/ice_cream.svg", name: "Ice Cream", bgColor: "#ecfeff" },
    { id: "G", image: "images/grapes.svg", name: "Grapes", bgColor: "#f5f3ff" }
  ],
  matchingOrder: [
    { leftId: "G", rightId: "G" },
    { leftId: "H", rightId: "H" },
    { leftId: "I", rightId: "I" }
  ]
};
