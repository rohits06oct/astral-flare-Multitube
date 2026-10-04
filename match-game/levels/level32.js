/**
 * Level 32 Configuration: Songbirds & Raptors
 * Matching: Word Name on Left -> Object Image on Right
 */
window.LEVEL_32_CONFIG = {
  title: "Level 32: Birds & Raptors",
  subtitle: "Match bird names with their pictures",
  hintText: "Match bird names to their pictures!",
  enforceMatchingOrder: false,
  leftItems: [
    { id: "falcon", text: "Falcon", name: "Falcon", bgColor: "#f1f5f9" },
    { id: "hummingbird", text: "Hummingbird", name: "Hummingbird", bgColor: "#ecfdf5" },
    { id: "bluebird", text: "Bluebird", name: "Bluebird", bgColor: "#eff6ff" }
  ],
  rightItems: [
    { id: "hummingbird", image: "images/hummingbird.svg", name: "Emerald Hummingbird", bgColor: "#ecfdf5" },
    { id: "bluebird", image: "images/bluebird.svg", name: "Mountain Bluebird", bgColor: "#eff6ff" },
    { id: "falcon", image: "images/falcon.svg", name: "Speed Falcon", bgColor: "#f1f5f9" }
  ],
  matchingOrder: [
    { leftId: "falcon", rightId: "falcon" },
    { leftId: "hummingbird", rightId: "hummingbird" },
    { leftId: "bluebird", rightId: "bluebird" }
  ]
};
