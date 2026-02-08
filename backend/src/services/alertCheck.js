import prisma from "../config/db.js";
import riskService from "./riskService.js";
import createNotification from "./notification.js";

async function alertCheck(watch, neo, approach) {
  const missDistanceKm = parseFloat(approach.miss_distance.kilometers);
  const approachDate = new Date(approach.close_approach_date);
  const currDate = new Date();
  const risk = await riskService.riskLevel(neo, approach);

  if (missDistanceKm <= watch.alertDistanceKm) {
    let msg = `Asteroid ${neo.name} is within ${missDistanceKm.toFixed(0)} kms of Earth`;
    await createNotification(watch.userId, msg);
  }

  if (watch.lastRiskLevel !== risk.riskLevel) {
    let msg = `Risk level for asteroid ${neo.name} is ${risk.riskLevel}`;
    await prisma.watchedAsteroid.update({
      where: { id: watch.id },
      data: { lastRiskLevel: risk.riskLevel },
    });


    await createNotification(watch.userId, msg);
  }

  const daysAway = Math.ceil((approachDate - currDate) / (1000 * 60 * 60 * 24));

  if (daysAway === watch.alertDaysBefore) {
    let msg = `Asteroid ${neo.name} will pass Earth in ${daysAway} days`;
    await createNotification(watch.userId, msg);
  }
}

export default alertCheck;
