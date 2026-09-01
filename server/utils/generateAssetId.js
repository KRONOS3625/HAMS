const Counter = require("../models/Counter");
const Asset = require("../models/Asset");

async function generateAssetId() {

    for (let attempts = 0; attempts < 100; attempts++) {
        const counter = await Counter.findByIdAndUpdate(
            "ASSET",
            {
                $inc: {
                    sequenceValue: 1
                }
            },
            {
                new: true,
                upsert: true
            }
        );

        const assetId = `AST-${1000 + counter.sequenceValue}`;
        const exists = await Asset.exists({ assetId });

        if (!exists) {
            return assetId;
        }
    }

    throw new Error("Unable to generate a unique asset ID.");
}

module.exports = generateAssetId;
