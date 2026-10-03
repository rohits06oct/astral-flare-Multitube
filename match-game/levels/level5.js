/**
 * LEVEL 5 CONFIGURATION
 * Edit this file to customize items, images, and matching order for Level 5.
 */
window.LEVEL_CONFIG = window.LEVEL_CONFIG || {};

window.LEVEL_CONFIG[5] = {
  levelNumber: 5,
  title: "Level 5",
  enforceMatchingOrder: false,
  hintText: "Cast the spells and unlock treasures in any order!",

  leftItems: [
    {
      id: "wizard_hat",
      name: "Wizard Hat",
      image: "images/wizard_hat.svg",
      bgColor: "#ede7f6"
    },
    {
      id: "chest",
      name: "Treasure Chest",
      image: "images/chest.svg",
      bgColor: "#efebe9"
    },
    {
      id: "star_magic",
      name: "Magic Star",
      image: "images/star.svg",
      bgColor: "#fff8e1"
    }
  ],

  rightItems: [
    {
      id: "wand",
      name: "Magic Wand",
      image: "images/magic_wand.svg",
      bgColor: "#f3e5f5"
    },
    {
      id: "key",
      name: "Golden Key",
      image: "images/key.svg",
      bgColor: "#fff9c4"
    },
    {
      id: "moon_magic",
      name: "Cosmic Moon",
      image: "images/moon.svg",
      bgColor: "#ede7f6"
    }
  ],

  // REQUIRED MATCHING ORDER:
  // 1st: Wizard Hat -> Magic Wand
  // 2nd: Treasure Chest -> Golden Key
  // 3rd: Magic Star -> Cosmic Moon
  matchingOrder: [
    { leftId: "wizard_hat", rightId: "wand", label: "Wizard Hat casts with Wand" },
    { leftId: "chest", rightId: "key", label: "Chest opens with Key" },
    { leftId: "star_magic", rightId: "moon_magic", label: "Star shines with Moon" }
  ]
};
