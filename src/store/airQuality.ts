import { create } from "zustand";
import { AirQualityData, AirQualityStatus } from "../types/airQuality";
import { fetchNearbyAirQuality } from "../api/airQuality";
import {
  getPM25Status,
  getPM10Status,
  getWorstAirQualityStatus,
} from "../utils/airQuality";

interface AirQualityStore {
  data: AirQualityData | null;
  status: AirQualityStatus | null;
  isLoading: boolean;
  error: string | null;
  fetchData: (latitude: number, longitude: number) => Promise<void>;
}

export const useAirQualityStore = create<AirQualityStore>((set) => ({
  data: null,
  status: null,
  isLoading: false,
  error: null,
  fetchData: async (latitude: number, longitude: number) => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchNearbyAirQuality(latitude, longitude);
      const pm25Status = getPM25Status(data.pm25);
      const pm10Status = getPM10Status(data.pm10);
      const worstStatus = getWorstAirQualityStatus(pm25Status, pm10Status);

      set({
        data,
        status: worstStatus,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다.",
        isLoading: false,
      });
    }
  },
}));
