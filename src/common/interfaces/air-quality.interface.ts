export interface AirQualityData {
  pm10: number;
  pm25: number;
  location: string;
  timestamp: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Station {
  stationName: string;
  addr: string;
  latitude: number;
  longitude: number;
  pm10Value: string;
  pm25Value: string;
  dataTime: string;
  sidoName: string;
}
