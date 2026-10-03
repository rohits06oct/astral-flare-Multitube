/**
 * Level 1 Configuration: Alphabet A, B, C
 * Matching: Letter -> Object (Order scrambled on right side)
 */
window.LEVEL_1_CONFIG = {
  title: "Level 1: Alphabet A, B, C",
  subtitle: "Match each alphabet letter with the correct image",
  hintText: "Match letters to items in any order!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "A", text: "A", name: "Letter A", bgColor: "#eff6ff" },
    { id: "B", text: "B", name: "Letter B", bgColor: "#fefce8" },
    { id: "C", text: "C", name: "Letter C", bgColor: "#fef2f2" }
  ],
  rightItems: [
    { id: "B", image: "images/banana.svg", name: "Banana", bgColor: "#fefce8" },
    { id: "C", image: "images/cat.svg", name: "Cat", bgColor: "#fef2f2" },
    { id: "A", image: "images/apple.svg", name: "Apple", bgColor: "#eff6ff" }
  ],
  matchingOrder: [
    { leftId: "A", rightId: "A" },
    { leftId: "B", rightId: "B" },
    { leftId: "C", rightId: "C" }
  ]
};
