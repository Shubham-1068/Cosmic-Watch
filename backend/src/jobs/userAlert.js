import cron from "node-cron";
import prisma from "../config/db.js";
import nasaService from "../services/nasaService.js";
import alertCheck from "../services/alertCheck.js";

cron.schedule("0 * * * *", async () => {
  console.log("Running alert check...");

  try {
    const data = await nasaService.getNeoData();
    const allNeos = Object.values(data.near_earth_objects).flat();

    const watched = await prisma.watchedAsteroid.findMany({
      include: { user: true },
    });

    for (let watch of watched) {
      const neo = allNeos.find((n) => n.id === watch.neoId);
      if (!neo) continue;
      const approach = neo.close_approach_data[0];
      if (!approach) continue;

      await alertCheck(watch, neo, approach);
    }
  } catch (error) {
    console.error("Error running alert :", error);
  }

});
