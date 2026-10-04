/**
 * Perhitungan Arah Kiblat & Jarak ke Ka'bah (Makkah al-Mukarramah)
 * Menggunakan rumus Trigonometri Bola (Great-Circle Distance & Forward Azimuth)
 */

export const KAABA_COORDINATES = {
  latitude: 21.422487,
  longitude: 39.826206,
  name: "Ka'bah, Masjidil Haram, Makkah",
};

export interface QiblaResult {
  bearingDegrees: number; // Sudut derajat dari Utara sejati (0 - 360°)
  bearingCardinal: string; // Misal: "Barat Laut (295°)"
  distanceKm: number; // Jarak garis lurus ke Makkah
}

export function calculateQiblaDirection(latitude: number, longitude: number): QiblaResult {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const phi1 = toRad(latitude);
  const phi2 = toRad(KAABA_COORDINATES.latitude);
  const deltaLambda = toRad(KAABA_COORDINATES.longitude - longitude);

  // Great-Circle initial bearing formula
  const y = Math.sin(deltaLambda);
  const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(deltaLambda);
  let bearing = toDeg(Math.atan2(y, x));
  bearing = (bearing + 360) % 360;

  // Haversine formula for distance
  const R = 6371; // Radius bumi dalam km
  const deltaPhi = toRad(KAABA_COORDINATES.latitude - latitude);
  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = Math.round(R * c);

  // Cardinal direction label
  const roundedBearing = Math.round(bearing * 10) / 10;
  let cardinal = "Utara";
  if (bearing >= 22.5 && bearing < 67.5) cardinal = "Timur Laut";
  else if (bearing >= 67.5 && bearing < 112.5) cardinal = "Timur";
  else if (bearing >= 112.5 && bearing < 157.5) cardinal = "Tenggara";
  else if (bearing >= 157.5 && bearing < 202.5) cardinal = "Selatan";
  else if (bearing >= 202.5 && bearing < 247.5) cardinal = "Barat Daya";
  else if (bearing >= 247.5 && bearing < 292.5) cardinal = "Barat";
  else if (bearing >= 292.5 && bearing < 337.5) cardinal = "Barat Laut";

  return {
    bearingDegrees: roundedBearing,
    bearingCardinal: `${cardinal} (${Math.round(roundedBearing)}°)`,
    distanceKm,
  };
}
