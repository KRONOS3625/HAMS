const Counter = require("../models/Counter");
const Complaint = require("../models/Complaint");

async function generateComplaintId() {

    const year = new Date().getFullYear();

    for (let attempts = 0; attempts < 100; attempts++) {
        const counter = await Counter.findByIdAndUpdate(
            `COMPLAINT_${year}`,
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

        const complaintId = `CMP-${year}-${String(counter.sequenceValue).padStart(3, "0")}`;
        const exists = await Complaint.exists({ complaintId });

        if (!exists) {
            return complaintId;
        }
    }

    throw new Error("Unable to generate a unique complaint ID.");
}

module.exports = generateComplaintId;
