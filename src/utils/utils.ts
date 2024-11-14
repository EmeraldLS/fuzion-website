export const formatCurrency = (value: number) => {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const checkIPAuthentication = async (
  accessibleIPs: string[],
  userIP: string
) => {
  if (accessibleIPs.includes("0.0.0.0")) {
    return true;
  }

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getGeolocation = async (ip: string) => {
    const response = await fetch(`https://freegeoip.app/json/${ip}`);
    const data = await response.json();
    return {
      latitude: data.latitude,
      longitude: data.longitude,
    };
  };

  const userLocation = await getGeolocation(userIP);

  for (const ip of accessibleIPs) {
    const location = await getGeolocation(ip);
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      location.latitude,
      location.longitude
    );
    if (distance <= 2) {
      return true;
    }
  }
  return false;
};
