const mongoose = require('mongoose');

module.exports = mongoose.model(
    'Guild',
    new mongoose.Schema({
        _id: { type: String, required: true }, // ID of the guild
        wallpaper_channel: { type: String, default: null }, // ID of the channel where wallpapers are sent
        twitter_channel: { type: String, default: null }, // ID of the channel where tweets are sent
    }
));

/**
 * Schema inutilizado
 */