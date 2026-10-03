/**
 * Level 14 Configuration: Hard Wizard Relics (Hard Objects Level)
 * Matching: Fantasy Artifact -> Magic Catalyst (Order scrambled on right side)
 */
window.LEVEL_14_CONFIG = {
  title: "Level 14: Hard Wizard Relics",
  subtitle: "Match mystic relics with their magical catalysts",
  hintText: "Cast your connections in any order!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "wizard", image: "images/wizard_hat.svg", name: "Wizard Hat", bgColor: "#f3e8ff" },
    { id: "chest", image: "images/chest.svg", name: "Treasure Chest", bgColor: "#fef3c7" },
    { id: "star", image: "images/star.svg", name: "Enchanted Star", bgColor: "#fefce8" },
    { id: "drool", image: "images/drool_emoji.svg", name: "Mystic Golem", bgColor: "#ecfeff" }
  ],
  rightItems: [
    { id: "chest", image: "images/key.svg", name: "Golden Key", bgColor: "#fef3c7" },
    { id: "wizard", image: "images/magic_wand.svg", name: "Magic Wand", bgColor: "#f3e8ff" },
    { id: "drool", image: "images/donut.svg", name: "Mana Donut", bgColor: "#fdf2f8" },
    { id: "star", image: "images/moon.svg", name: "Cosmic Moon", bgColor: "#e0e7ff" }
  ],
  matchingOrder: [
    { leftId: "wizard", rightId: "wizard" },
    { leftId: "chest", rightId: "chest" },
    { leftId: "star", rightId: "star" },
    { leftId: "drool", rightId: "drool" }
  ]
};
