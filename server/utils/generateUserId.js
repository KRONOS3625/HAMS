const Counter = require("../models/Counter");
const User = require("../models/User");

async function getNextSequence(counterName) {
    const counter = await Counter.findByIdAndUpdate(
        counterName,
        { $inc: { sequenceValue: 1 } },
        {
            new: true,
            upsert: true
        }
    );

    return counter.sequenceValue;
}

async function generateUserId(role) {

    let prefix = "EMP";

    if (role === "admin") {
        prefix = "ADM";
    }

    if (role === "technician") {
        prefix = "TEC";
    }

    for (let attempts = 0; attempts < 100; attempts++) {
        const sequence = await getNextSequence(prefix);
        const userId = `${prefix}${String(sequence).padStart(3, "0")}`;
        const exists = await User.exists({ userId });

        if (!exists) {
            return userId;
        }
    }

    throw new Error("Unable to generate a unique user ID.");
}

module.exports = generateUserId;
