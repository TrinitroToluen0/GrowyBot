const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema(
    {
        articleId: {
            type: String,
            required: true,
        },
        serverId: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
    },
    { versionkey: false }
);

module.exports = mongoose.model("Shop", shopSchema, "Shops");
