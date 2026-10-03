/**
 * Level 4 Configuration: Animals & Treats (Item Objects Level)
 * Matching: Animal -> Favorite Food (Order scrambled on right side)
 */
window.LEVEL_4_CONFIG = {
  title: "Level 4: Animals & Treats",
  subtitle: "Match each friendly animal with their favorite food",
  hintText: "Match animals to treats in any order!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "dog", image: "images/dog.svg", name: "Puppy Dog", bgColor: "#fff7ed" },
    { id: "cat", image: "images/cat.svg", name: "Kitty Cat", bgColor: "#fef2f2" },
    { id: "monkey", image: "images/monkey.svg", name: "Playful Monkey", bgColor: "#fefce8" },
    { id: "bee", image: "images/bee.svg", name: "Busy Bee", bgColor: "#fef3c7" }
  ],
  rightItems: [
    { id: "cat", image: "images/fish.svg", name: "Delicious Fish", bgColor: "#ecfeff" },
    { id: "bee", image: "images/honey.svg", name: "Sweet Honey", bgColor: "#fef3c7" },
    { id: "dog", image: "images/bone.svg", name: "Tasty Bone", bgColor: "#fff7ed" },
    { id: "monkey", image: "images/banana.svg", name: "Yellow Banana", bgColor: "#fefce8" }
  ],
  matchingOrder: [
    { leftId: "dog", rightId: "dog" },
    { leftId: "cat", rightId: "cat" },
    { leftId: "monkey", rightId: "monkey" },
    { leftId: "bee", rightId: "bee" }
  ]
};
