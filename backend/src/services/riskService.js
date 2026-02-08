async function riskLevel(neo, approach) {
  let risk = 0, riskLevel="Low";

  let diameter = neo.estimated_diameter.kilometers.estimated_diameter_max;
  let distance = approach.miss_distance.kilometers;
  let velocity = approach.relative_velocity.kilometers_per_second;

  if (diameter > 0.5) {
    risk += 30;
  }
  if (distance < 5000000) {
    risk += 40;
  }
  if (velocity > 20) {
    risk += 20;
  }
  if (neo.is_potentially_hazardous_asteroid) {
    risk += 10;
  }

  if (risk >= 70) {
    riskLevel = "High";
  } else if (risk >= 50) {
    riskLevel = "Medium";
  }

  return {risk, riskLevel};
}

export default { riskLevel }; 
  