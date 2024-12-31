const mongoose = require("mongoose");

const settingsSchema = mongoose.Schema(
  {
    privacy: {
      profileVisibility: {
        type: String,
        enum: ["Public", "Friends", "Private"],
        default: "Friends",
      },
    },

    security: {
      twoFactorAuth: {
        type: Boolean,
        default: false, // Enable or disable 2FA
      },
      lastLogin: {
        type: Date, // Track last login time
        default: Date.now,
      },
    },

    theme: {
      type: String,
      enum: ["Light", "Dark"],
      default: "Dark", // Default theme
    },

    chatWallpaper: {
      type: String, // URL or identifier for wallpaper
      default: "default_wallpaper_url", // Replace with your actual default wallpaper URL
    },

    requestAccountInfo: {
      type: Boolean,
      default: false, // Placeholder for request account info functionality
    },
    keyboardShortcuts: {
      type: Boolean,
      default: true, // Enable or disable keyboard shortcuts
    },

    help: {
      type: String,
      default: "https://support.example.com", // Link to help or support
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

const Settings = mongoose.model("Setting", settingsSchema);

module.exports = Settings;
