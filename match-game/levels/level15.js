/**
 * Level 15 Configuration: Alphabet Grand Finale V to Z (5 items!)
 * Matching: Letter -> Object (Order scrambled on right side)
 */
window.LEVEL_15_CONFIG = {
  title: "Level 15: Alphabet Finale V to Z",
  subtitle: "Master the final 5 alphabets together!",
  hintText: "Match the final 5 letters in any order!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "V", text: "V", name: "Letter V", bgColor: "#f0fdf4" },
    { id: "W", text: "W", name: "Letter W", bgColor: "#fef2f2" },
    { id: "X", text: "X", name: "Letter X", bgColor: "#eff6ff" },
    { id: "Y", text: "Y", name: "Letter Y", bgColor: "#fefce8" },
    { id: "Z", text: "Z", name: "Letter Z", bgColor: "#fdf4ff" }
  ],
  rightItems: [
    { id: "W", image: "images/watermelon.svg", name: "Watermelon", bgColor: "#fef2f2" },
    { id: "X", image: "images/xylophone.svg", name: "Xylophone", bgColor: "#eff6ff" },
    { id: "Z", image: "images/zebra.svg", name: "Zebra", bgColor: "#fdf4ff" },
    { id: "V", image: "images/van.svg", name: "Van", bgColor: "#f0fdf4" },
    { id: "Y", image: "images/yoyo.svg", name: "Yo-yo", bgColor: "#fefce8" }
  ],
  matchingOrder: [
    { leftId: "V", rightId: "V" },
    { leftId: "W", rightId: "W" },
    { leftId: "X", rightId: "X" },
    { leftId: "Y", rightId: "Y" },
    { leftId: "Z", rightId: "Z" }
  ]
};
