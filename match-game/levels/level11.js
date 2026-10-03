/**
 * Level 11 Configuration: Alphabet P, Q, R
 * Matching: Letter -> Object (Order scrambled on right side)
 */
window.LEVEL_11_CONFIG = {
  title: "Level 11: Alphabet P, Q, R",
  subtitle: "Match each alphabet letter with the correct image",
  hintText: "Match letters to items in any order!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "P", text: "P", name: "Letter P", bgColor: "#ecfeff" },
    { id: "Q", text: "Q", name: "Letter Q", bgColor: "#fdf4ff" },
    { id: "R", text: "R", name: "Letter R", bgColor: "#fefce8" }
  ],
  rightItems: [
    { id: "Q", image: "images/queen.svg", name: "Queen", bgColor: "#fdf4ff" },
    { id: "R", image: "images/rainbow.svg", name: "Rainbow", bgColor: "#fefce8" },
    { id: "P", image: "images/penguin.svg", name: "Penguin", bgColor: "#ecfeff" }
  ],
  matchingOrder: [
    { leftId: "P", rightId: "P" },
    { leftId: "Q", rightId: "Q" },
    { leftId: "R", rightId: "R" }
  ]
};
