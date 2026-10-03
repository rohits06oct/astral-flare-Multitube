/**
 * LEVEL 2 CONFIGURATION
 * Edit this file to customize items, images, and matching order for Level 2.
 */
window.LEVEL_CONFIG = window.LEVEL_CONFIG || {};

window.LEVEL_CONFIG[2] = {
  levelNumber: 2,
  title: "Quiz 2",
  enforceMatchingOrder: false,
  hintText: "Match each animal with its favorite treat in any order!",

  leftItems: [
    {
      id: "dog",
      name: "Happy Dog",
      image: "images/dog.svg",
      bgColor: "#fff3e0"
    },
    {
      id: "cat",
      name: "Playful Cat",
      image: "images/cat.svg",
      bgColor: "#ffe0b2"
    },
    {
      id: "monkey",
      name: "Cheeky Monkey",
      image: "images/monkey.svg",
      bgColor: "#d7ccc8"
    },
    {
      id: "bee",
      name: "Buzzy Bee",
      image: "images/bee.svg",
      bgColor: "#fff9c4"
    }
  ],

  rightItems: [
    {
      id: "honey",
      name: "Honey Pot",
      image: "images/honey.svg",
      bgColor: "#ffe082"
    },
    {
      id: "bone",
      name: "Dog Bone",
      image: "images/bone.svg",
      bgColor: "#ffecb3"
    },
    {
      id: "banana",
      name: "Yellow Banana",
      image: "images/banana.svg",
      bgColor: "#fff9c4"
    },
    {
      id: "fish",
      name: "Blue Fish",
      image: "images/fish.svg",
      bgColor: "#b3e5fc"
    }
  ],

  // REQUIRED MATCHING ORDER (Decided by you):
  // 1st: Dog -> Bone
  // 2nd: Cat -> Fish
  // 3rd: Monkey -> Banana
  // 4th: Bee -> Honey
  matchingOrder: [
    { leftId: "dog", rightId: "bone", label: "Dog loves Bone" },
    { leftId: "cat", rightId: "fish", label: "Cat loves Fish" },
    { leftId: "monkey", rightId: "banana", label: "Monkey loves Banana" },
    { leftId: "bee", rightId: "honey", label: "Bee makes Honey" }
  ]
};
