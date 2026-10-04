/**
 * Level 26 Configuration: Graceful Birds
 * Matching: Word Name on Left -> Object Image on Right
 */
window.LEVEL_26_CONFIG = {
  title: "Level 26: Graceful Birds",
  subtitle: "Match bird names with their pictures",
  hintText: "Match bird names to their pictures!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "flamingo", text: "Flamingo", name: "Flamingo", bgColor: "#fdf2f8" },
    { id: "peacock", text: "Peacock", name: "Peacock", bgColor: "#ecfeff" },
    { id: "duck", text: "Duck", name: "Duck", bgColor: "#fefce8" }
  ],
  rightItems: [
    { id: "peacock", image: "images/peacock.svg", name: "Royal Peacock", bgColor: "#ecfeff" },
    { id: "duck", image: "images/duck.svg", name: "Quacking Duck", bgColor: "#fefce8" },
    { id: "flamingo", image: "images/flamingo.svg", name: "Pink Flamingo", bgColor: "#fdf2f8" }
  ],
  matchingOrder: [
    { leftId: "flamingo", rightId: "flamingo" },
    { leftId: "peacock", rightId: "peacock" },
    { leftId: "duck", rightId: "duck" }
  ]
};
