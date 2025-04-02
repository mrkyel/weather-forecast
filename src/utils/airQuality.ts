import { AirQualityLevel, AirQualityStatus } from "../types/airQuality";

const PM25_LEVELS = {
  GOOD: 15,
  MODERATE: 25,
  SENSITIVE: 50,
  BAD: 75,
  VERY_BAD: 100,
};

const PM10_LEVELS = {
  GOOD: 30,
  MODERATE: 50,
  SENSITIVE: 100,
  BAD: 150,
  VERY_BAD: 200,
};

const STATUS_COLORS = {
  좋음: "#4CAF50",
  보통: "#FFB300",
  "민감군 영향": "#FB8C00",
  나쁨: "#F44336",
  "매우 나쁨": "#7B1FA2",
  위험: "#B71C1C",
};

const STATUS_MESSAGES = {
  좋음: "좋음",
  보통: "보통",
  "민감군 영향": "민감군 영향",
  나쁨: "나쁨",
  "매우 나쁨": "매우 나쁨",
  위험: "위험",
};

export const getPM25Status = (value: number): AirQualityStatus => {
  let level: AirQualityLevel;

  if (value <= PM25_LEVELS.GOOD) {
    level = "좋음";
  } else if (value <= PM25_LEVELS.MODERATE) {
    level = "보통";
  } else if (value <= PM25_LEVELS.SENSITIVE) {
    level = "민감군 영향";
  } else if (value <= PM25_LEVELS.BAD) {
    level = "나쁨";
  } else if (value <= PM25_LEVELS.VERY_BAD) {
    level = "매우 나쁨";
  } else {
    level = "위험";
  }

  return {
    level,
    value,
    message: STATUS_MESSAGES[level],
    color: STATUS_COLORS[level],
  };
};

export const getPM10Status = (value: number): AirQualityStatus => {
  let level: AirQualityLevel;

  if (value <= PM10_LEVELS.GOOD) {
    level = "좋음";
  } else if (value <= PM10_LEVELS.MODERATE) {
    level = "보통";
  } else if (value <= PM10_LEVELS.SENSITIVE) {
    level = "민감군 영향";
  } else if (value <= PM10_LEVELS.BAD) {
    level = "나쁨";
  } else if (value <= PM10_LEVELS.VERY_BAD) {
    level = "매우 나쁨";
  } else {
    level = "위험";
  }

  return {
    level,
    value,
    message: STATUS_MESSAGES[level],
    color: STATUS_COLORS[level],
  };
};

export const getWorstAirQualityStatus = (
  pm25Status: AirQualityStatus,
  pm10Status: AirQualityStatus
): AirQualityStatus => {
  const levels: Record<AirQualityLevel, number> = {
    좋음: 1,
    보통: 2,
    "민감군 영향": 3,
    나쁨: 4,
    "매우 나쁨": 5,
    위험: 6,
  };

  return levels[pm25Status.level] >= levels[pm10Status.level]
    ? pm25Status
    : pm10Status;
};
