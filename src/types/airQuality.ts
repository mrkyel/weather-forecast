export type AirQualityLevel =
  | "좋음"
  | "보통"
  | "민감군 영향"
  | "나쁨"
  | "매우 나쁨"
  | "위험";

export interface AirQualityData {
  pm10: number;
  pm25: number;
  station: string;
  timestamp: string;
  grade: AirQualityLevel;
}

export interface AirQualityStatus {
  level: AirQualityLevel;
  value: number;
  message: string;
  color: string;
}
