const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema(
    {
        guildId: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    { versionKey: false }
);

module.exports = mongoose.model("Shop", shopSchema, "Shops");
