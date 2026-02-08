import prisma from "../config/db.js";

async function createNotification(userId, msg) {
    try {
        await prisma.notification.create({
            data: {
                userId,
                message: msg,
            }
        })
    } catch (error) {
        console.error("Error creating notification: ", error);
    }
}

export default createNotification;