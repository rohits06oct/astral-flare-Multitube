/**
 * Level 3 Configuration: Alphabet D, E, F
 * Matching: Letter -> Object (Order scrambled on right side)
 */
window.LEVEL_3_CONFIG = {
  title: "Level 3: Alphabet D, E, F",
  subtitle: "Match each alphabet letter with the correct image",
  hintText: "Match letters to items in any order!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "D", text: "D", name: "Letter D", bgColor: "#fff7ed" },
    { id: "E", text: "E", name: "Letter E", bgColor: "#f5f3ff" },
    { id: "F", text: "F", name: "Letter F", bgColor: "#ecfeff" }
  ],
  rightItems: [
    { id: "E", image: "images/elephant.svg", name: "Elephant", bgColor: "#f5f3ff" },
    { id: "F", image: "images/fish.svg", name: "Fish", bgColor: "#ecfeff" },
    { id: "D", image: "images/dog.svg", name: "Dog", bgColor: "#fff7ed" }
  ],
  matchingOrder: [
    { leftId: "D", rightId: "D" },
    { leftId: "E", rightId: "E" },
    { leftId: "F", rightId: "F" }
  ]
};
