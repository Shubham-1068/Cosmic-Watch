import nasaService from "../services/nasaService.js";
import riskService from "../services/riskService.js";

async function getNeoFeed(req, res) {
  const data = await nasaService.getNeoData();

  const neos = Object.values(data.near_earth_objects).flat();

  const asteroids = await Promise.all(
    neos.map(async (neo) => {
      const approach = neo.close_approach_data[0];

      const {risk, riskLevel} = await riskService.riskLevel(neo, approach);

      return {
        id: neo.id,
        name: neo.name,
        diameter_km: neo.estimated_diameter.kilometers.estimated_diameter_max,
        velocity_kms: parseFloat(
          approach.relative_velocity.kilometers_per_second,
        ),
        miss_distance_km: parseFloat(approach.miss_distance.kilometers),
        hazardous: neo.is_potentially_hazardous_asteroid,
        risk,
      };
    })
  );

  res.json(asteroids);
}

async function getNeoFeedById(req, res) {
  const id = req.params.id;
  const data = await nasaService.getNeoData();
  const neo = data.near_earth_objects[Object.keys(data.near_earth_objects)[0]].find((neo) => neo.id === id);
  if(!neo){
    return res.status(404).json({message: "Asteroid not found"});
  }

  const approach = neo.close_approach_data[0];

  const {risk, riskLevel} = await riskService.riskLevel(neo, approach);

  res.json({
    id: neo.id,
    name: neo.name,
    diameter_km: neo.estimated_diameter.kilometers.estimated_diameter_max,
    velocity_kms: parseFloat(
      approach.relative_velocity.kilometers_per_second,
    ),
    miss_distance_km: parseFloat(approach.miss_distance.kilometers),
    hazardous: neo.is_potentially_hazardous_asteroid,
    risk,
  });
}
  

export {getNeoFeed, getNeoFeedById};
