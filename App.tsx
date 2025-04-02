import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
  Platform,
  Image,
  RefreshControl,
  ScrollView,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import { api } from "./src/api/axios";

// API URL 설정
const API_URL = "https://kale-weather-forecast-backend.vercel.app";

console.log("App.tsx API_URL:", API_URL);

interface AirQualityData {
  pm10Value: number;
  pm25Value: number;
  pm10Grade: number;
  pm25Grade: number;
  dataTime: string;
  stationName: string;
  sidoName: string;
  gradeEmoji: string;
  backgroundColor: string;
  warningMessage: string;
  temperature: number;
  weatherIcon: string;
  weatherDescription: string;
}

export default function App() {
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setError(null);
      setLoading(true);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("위치 권한이 필요합니다.");
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const response = await api.get("/air-quality", {
        params: { latitude, longitude },
      });

      setAirQuality(response.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      setError(errorMessage);
      Alert.alert("오류", errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>미세먼지 정보를 가져오는 중...</Text>
      </View>
    );
  }

  if (error && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.retryText} onPress={fetchData}>
          다시 시도하기
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: airQuality?.backgroundColor },
        ]}
      >
        <View style={styles.card}>
          {/* 위치와 시간 */}
          <View style={styles.header}>
            <Text style={styles.locationText}>
              {airQuality?.sidoName} {airQuality?.stationName}
            </Text>
            <Text style={styles.timeText}>{airQuality?.dataTime}</Text>
          </View>

          {/* 날씨 정보 */}
          <View style={styles.weatherBox}>
            <View style={styles.weatherContent}>
              {airQuality?.weatherIcon && (
                <Image
                  source={{
                    uri: `https://openweathermap.org/img/wn/${airQuality.weatherIcon}.png`,
                  }}
                  style={styles.weatherIcon}
                  resizeMode="contain"
                />
              )}
              <View style={styles.tempInfo}>
                <Text style={styles.temperature}>
                  {airQuality?.temperature}°C
                </Text>
                <Text style={styles.weatherDescription}>
                  {airQuality?.weatherDescription}
                </Text>
              </View>
            </View>
          </View>

          {/* 등급 이모지 */}
          <View style={styles.gradeContainer}>
            <Text style={styles.gradeEmoji}>{airQuality?.gradeEmoji}</Text>
            {airQuality?.warningMessage && (
              <Text style={styles.warningText}>
                {airQuality.warningMessage}
              </Text>
            )}
          </View>

          {/* 미세먼지 수치 */}
          <View style={styles.dustBox}>
            <View style={styles.dustItem}>
              <Text style={styles.dustLabel}>미세먼지</Text>
              <Text style={styles.dustValue}>{airQuality?.pm10Value}</Text>
              <Text style={styles.dustUnit}>µg/m³</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.dustItem}>
              <Text style={styles.dustLabel}>초미세먼지</Text>
              <Text style={styles.dustValue}>{airQuality?.pm25Value}</Text>
              <Text style={styles.dustUnit}>µg/m³</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    margin: 20,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    ...(Platform.OS === "web"
      ? {
          boxShadow: "0px 2px 3.84px rgba(0, 0, 0, 0.25)",
        }
      : {
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }),
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  locationText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  timeText: {
    fontSize: 14,
    color: "#666",
  },
  weatherBox: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  weatherContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  weatherIcon: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  tempInfo: {
    flexDirection: "column",
  },
  temperature: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
  },
  weatherDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  gradeContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  gradeEmoji: {
    fontSize: 72,
    marginBottom: 10,
  },
  warningText: {
    fontSize: 16,
    color: "#ff4444",
    fontWeight: "bold",
    textAlign: "center",
  },
  dustBox: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 15,
    padding: 20,
  },
  dustItem: {
    alignItems: "center",
    flex: 1,
  },
  divider: {
    width: 1,
    height: "100%",
    backgroundColor: "#ddd",
    marginHorizontal: 15,
  },
  dustLabel: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  dustValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  dustUnit: {
    fontSize: 12,
    color: "#999",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#ff4444",
    textAlign: "center",
    marginBottom: 10,
  },
  retryText: {
    fontSize: 16,
    color: "#0000ff",
    textDecorationLine: "underline",
  },
});
