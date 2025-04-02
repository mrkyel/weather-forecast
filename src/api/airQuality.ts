import { AirQualityData } from "../types/airQuality";
import api from "./axios";

// 네이버 모바일 날씨 URL (위치 기반)
const NAVER_WEATHER_MOBILE_URL = (lat: number, lon: number) =>
  `https://m.weather.naver.com/air/${lat},${lon}`;

export const fetchNearbyAirQuality = async (
  latitude: number,
  longitude: number
): Promise<AirQualityData> => {
  try {
    const { data } = await api.get<AirQualityData>("/air-quality", {
      params: {
        lat: latitude,
        lng: longitude,
      },
    });

    return data;
  } catch (error) {
    console.error("Air quality data fetch error:", error);
    throw new Error("미세먼지 정보를 가져오는데 실패했습니다.");
  }
};
