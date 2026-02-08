import prisma from "../config/db.js";

async function watch(req, res) {
  const { neoId, alertDistanceKm, alertDaysBefore } = req.body;
  if(!neoId || !alertDistanceKm || !alertDaysBefore){
    return res.status(400).json({message: "Missing fields"});
  }

  await prisma.watchedAsteroid.create({
    data: {
      neoId,
      alertDistanceKm,
      alertDaysBefore,
      userId: req.user.id,
    }
  });
  return res.status(200).json({message: "Asteroid added to watchlist"});
}

async function unWatch(req, res) {
    const neoId = req.params.neoId;
    if(!neoId){
        return res.status(400).json({message: "Missing fields"});
    }

    await prisma.watchedAsteroid.delete({
        where: {
            neoId_userId: {
                neoId,
                userId: req.user.id,
            }
        }
    });
    return res.status(200).json({message: "Asteroid removed from watchlist"});
}

async function getWatchlist(req, res) {
  try {
    const watched = await prisma.watchedAsteroid.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ watchlist: watched });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch watchlist", error: error.message });
  }
}

async function getNotifications(req, res) {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return res.status(200).json({ notifications });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch notifications", error: error.message });
  }
}

async function markNotificationRead(req, res) {
  const notificationId = req.params.id;
  if (!notificationId) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const result = await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId: req.user.id,
      },
      data: { isRead: true },
    });

    if (result.count === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update notification", error: error.message });
  }
}

export {
  watch,
  unWatch,
  getWatchlist,
  getNotifications,
  markNotificationRead,
};