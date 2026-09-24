import type { City } from '../lib/weather'

// The 10 pins on the Weather Globe. Tip from the design: put your own city first.
export const cities: City[] = [
  { name: 'London', lat: 51.51, lon: -0.13 },
  { name: 'New York', lat: 40.71, lon: -74.01 },
  { name: 'Los Angeles', lat: 34.05, lon: -118.24 },
  { name: 'São Paulo', lat: -23.55, lon: -46.63 },
  { name: 'Reykjavík', lat: 64.15, lon: -21.94 },
  { name: 'Lagos', lat: 6.52, lon: 3.38 },
  { name: 'Cairo', lat: 30.04, lon: 31.24 },
  { name: 'Mumbai', lat: 19.08, lon: 72.88 },
  { name: 'Tokyo', lat: 35.68, lon: 139.69 },
  { name: 'Sydney', lat: -33.87, lon: 151.21 },
]
