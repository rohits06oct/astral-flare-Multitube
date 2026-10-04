/**
 * Level 32 Configuration: Songbirds & Hunters - Aero Aviary
 * Matching: Falcon, Hummingbird, Bluebird (Order scrambled on right side)
 */
window.LEVEL_32_CONFIG = {
  title: "Level 32: Songbirds & Hunters",
  subtitle: "Match the speed falcon, emerald hummingbird, and bluebird",
  hintText: "Match soaring birds in any order!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "falcon", image: "images/falcon.svg", name: "Speed Falcon", bgColor: "#f1f5f9" },
    { id: "hummingbird", image: "images/hummingbird.svg", name: "Emerald Hummingbird", bgColor: "#ecfdf5" },
    { id: "bluebird", image: "images/bluebird.svg", name: "American Bluebird", bgColor: "#eff6ff" }
  ],
  rightItems: [
    { id: "hummingbird", image: "images/hummingbird.svg", name: "Emerald Hummingbird", bgColor: "#ecfdf5" },
    { id: "bluebird", image: "images/bluebird.svg", name: "American Bluebird", bgColor: "#eff6ff" },
    { id: "falcon", image: "images/falcon.svg", name: "Speed Falcon", bgColor: "#f1f5f9" }
  ],
  matchingOrder: [
    { leftId: "falcon", rightId: "falcon" },
    { leftId: "hummingbird", rightId: "hummingbird" },
    { leftId: "bluebird", rightId: "bluebird" }
  ]
};
