/**
 * Level 9 Configuration: Alphabet M, N, O
 * Matching: Letter -> Object (Order scrambled on right side)
 */
window.LEVEL_9_CONFIG = {
  title: "Level 9: Alphabet M, N, O",
  subtitle: "Match each alphabet letter with the correct image",
  hintText: "Match letters to items in any order!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "M", text: "M", name: "Letter M", bgColor: "#fff7ed" },
    { id: "N", text: "N", name: "Letter N", bgColor: "#f0fdf4" },
    { id: "O", text: "O", name: "Letter O", bgColor: "#fef3c7" }
  ],
  rightItems: [
    { id: "N", image: "images/nest.svg", name: "Nest", bgColor: "#f0fdf4" },
    { id: "O", image: "images/orange.svg", name: "Orange", bgColor: "#fef3c7" },
    { id: "M", image: "images/monkey.svg", name: "Monkey", bgColor: "#fff7ed" }
  ],
  matchingOrder: [
    { leftId: "M", rightId: "M" },
    { leftId: "N", rightId: "N" },
    { leftId: "O", rightId: "O" }
  ]
};
