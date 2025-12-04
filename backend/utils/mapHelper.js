// Map utilities for distance calculation and location handling

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {Object} coord1 - {lat, lng}
 * @param {Object} coord2 - {lat, lng}
 * @returns {Number} Distance in kilometers
 */
const calculateDistance = (coord1, coord2) => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLng = toRad(coord2.lng - coord1.lng);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.lat)) * Math.cos(toRad(coord2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal
};

const toRad = (value) => {
  return (value * Math.PI) / 180;
};

/**
 * Calculate estimated delivery time based on distance
 * @param {Number} distance - Distance in km
 * @param {Number} preparationTime - Food preparation time in minutes
 * @returns {Number} Total estimated time in minutes
 */
const calculateDeliveryTime = (distance, preparationTime = 20) => {
  const avgSpeed = 20; // km/h average delivery speed
  const travelTime = (distance / avgSpeed) * 60; // Convert to minutes
  return Math.ceil(preparationTime + travelTime);
};

/**
 * Find nearby restaurants within radius
 * @param {Object} userLocation - {lat, lng}
 * @param {Array} restaurants - Array of restaurant objects
 * @param {Number} radiusKm - Search radius in km
 * @returns {Array} Filtered and sorted restaurants by distance
 */
const findNearbyRestaurants = (userLocation, restaurants, radiusKm = 10) => {
  return restaurants
    .map(restaurant => {
      const distance = calculateDistance(
        userLocation,
        restaurant.address.coordinates
      );
      return {
        ...restaurant.toObject(),
        distance,
        estimatedDeliveryTime: calculateDeliveryTime(distance, restaurant.averageDeliveryTime)
      };
    })
    .filter(restaurant => restaurant.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance);
};

/**
 * Get Google Maps URL for directions
 * @param {Object} origin - {lat, lng}
 * @param {Object} destination - {lat, lng}
 * @returns {String} Google Maps URL
 */
const getDirectionsUrl = (origin, destination) => {
  return `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&travelmode=driving`;
};

/**
 * Format address for display
 * @param {Object} address - Address object
 * @returns {String} Formatted address
 */
const formatAddress = (address) => {
  return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
};

/**
 * Validate coordinates
 * @param {Object} coordinates - {lat, lng}
 * @returns {Boolean} True if valid
 */
const isValidCoordinates = (coordinates) => {
  if (!coordinates || typeof coordinates !== 'object') return false;
  
  const { lat, lng } = coordinates;
  
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    lat >= -90 && lat <= 90 &&
    lng >= -180 && lng <= 180
  );
};

/**
 * Get delivery zones based on restaurant location
 * @param {Object} restaurantLocation - {lat, lng}
 * @param {Number} maxRadius - Maximum delivery radius in km
 * @returns {Object} Zone configuration
 */
const getDeliveryZones = (restaurantLocation, maxRadius = 15) => {
  return {
    innerZone: {
      radius: maxRadius * 0.33,
      fee: 20,
      estimatedTime: 20
    },
    midZone: {
      radius: maxRadius * 0.67,
      fee: 40,
      estimatedTime: 35
    },
    outerZone: {
      radius: maxRadius,
      fee: 60,
      estimatedTime: 50
    }
  };
};

/**
 * Calculate delivery fee based on distance
 * @param {Number} distance - Distance in km
 * @returns {Number} Delivery fee
 */
const calculateDeliveryFee = (distance) => {
  if (distance <= 3) return 20;
  if (distance <= 7) return 40;
  if (distance <= 15) return 60;
  return 80;
};

module.exports = {
  calculateDistance,
  calculateDeliveryTime,
  findNearbyRestaurants,
  getDirectionsUrl,
  formatAddress,
  isValidCoordinates,
  getDeliveryZones,
  calculateDeliveryFee
};
