const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            required: true,
        },
        guildId: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    { versionkey: false }
);

module.exports = mongoose.model("Shop", shopSchema, "Shops");
