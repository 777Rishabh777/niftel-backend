// Utility function for flexible location matching
// This normalizes location names by removing case, spaces, and special characters
// Examples:
//   "Aminabad" -> "aminabad"
//   "Gomti Nagar" -> "gomtinagar"
//   "IIM-Road, Lucknow" -> "iimroadlucknow"

const normalizeLocation = (location) => {
  if (!location) return '';
  return location
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') // Remove all non-alphanumeric characters
    .trim();
};

// Check if two locations match (ignoring case, spaces, symbols)
const locationsMatch = (location1, location2) => {
  return normalizeLocation(location1) === normalizeLocation(location2);
};

// Group properties by normalized location
const groupByLocation = (properties) => {
  const groups = {};
  
  properties.forEach(prop => {
    if (!prop.location) return;
    
    const normalized = normalizeLocation(prop.location);
    if (!groups[normalized]) {
      groups[normalized] = {
        normalized: normalized,
        originalName: prop.location, // Keep first occurrence as display name
        properties: []
      };
    }
    groups[normalized].properties.push(prop);
  });
  
  return Object.values(groups);
};

module.exports = {
  normalizeLocation,
  locationsMatch,
  groupByLocation
};
