const Notification = require("../models/Notification");

async function createNotification(userId, title, message) {

    return await Notification.create({
        user: userId,
        title,
        message
    });

}

module.exports = createNotification;