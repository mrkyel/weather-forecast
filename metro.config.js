const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // Enable CSS support
  isCSSEnabled: true,
});

// Add additional configurations
config.resolver.sourceExts.push("mjs");
config.resolver.sourceExts.push("css");
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== "css"
);

module.exports = config;
