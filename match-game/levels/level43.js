/**
 * Level 43 Configuration: USA Eats & Sweet Treats
 * Matching: Word Name on Left -> Object Image on Right
 */
window.LEVEL_43_CONFIG = {
  title: "Level 43: USA Eats & Treats",
  subtitle: "Match treat names with their pictures",
  hintText: "Match food words to their pictures!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "taco", text: "Taco", name: "Taco", bgColor: "#fff7ed" },
    { id: "cookie", text: "Cookie", name: "Cookie", bgColor: "#fef3c7" },
    { id: "ice_pop", text: "Ice Pop", name: "Ice Pop", bgColor: "#eff6ff" }
  ],
  rightItems: [
    { id: "cookie", image: "images/cookie.svg", name: "Chocolate Chip Cookie", bgColor: "#fef3c7" },
    { id: "ice_pop", image: "images/ice_pop.svg", name: "Rocket Ice Pop", bgColor: "#eff6ff" },
    { id: "taco", image: "images/taco.svg", name: "Crispy Taco", bgColor: "#fff7ed" }
  ],
  matchingOrder: [
    { leftId: "taco", rightId: "taco" },
    { leftId: "cookie", rightId: "cookie" },
    { leftId: "ice_pop", rightId: "ice_pop" }
  ]
};
