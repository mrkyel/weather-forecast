import { useState, useEffect } from "react";
import { api } from "../api/axios";

interface Location {
  latitude: number;
  longitude: number;
}

interface AirQuality {
  sidoName: string;
  stationName: string;
  pm10Value: number;
  pm25Value: number;
  pm10Grade: string;
  pm25Grade: string;
  dataTime: string;
  gradeEmoji: string;
  backgroundColor: string;
  warningMessage: string;
  temperature: number;
  feelsLike: number;
  weatherIcon: string;
  weatherDescription: string;
}

export const useAirQuality = (location: Location | null) => {
  const [airQuality, setAirQuality] = useState<AirQuality | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAirQuality = async () => {
      if (!location) return;

      setLoading(true);
      setError(null);

      try {
        const response = await api.get("/air-quality", {
          params: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
        });

        setAirQuality(response.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAirQuality();
  }, [location]);

  return {
    airQuality,
    loading,
    error,
  };
};
