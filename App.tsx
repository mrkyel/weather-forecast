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
  NetInfo,
} from "react-native";
import * as Location from "expo-location";
import Constants from "expo-constants";

const API_URL =
  Constants.expoConfig?.extra?.expoPublicApiUrl || "http://10.50.2.153:3000";

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

      // 네트워크 연결 확인
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        throw new Error("인터넷 연결을 확인해주세요.");
      }

      // API URL 확인
      if (!API_URL) {
        throw new Error("서버 설정이 올바르지 않습니다.");
      }

      // 위치 권한 요청
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("위치 권한이 필요합니다.");
      }

      // 현재 위치 가져오기
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // 서버에서 데이터 가져오기
      const response = await fetch(
        `${API_URL}/air-quality?latitude=${latitude}&longitude=${longitude}`
      );

      if (!response.ok) {
        throw new Error("서버에서 데이터를 가져올 수 없습니다.");
      }

      const data = await response.json();
      setAirQuality(data);
    } catch (err) {
      setError(err.message);
      Alert.alert("오류", err.message);
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
    paddingTop: Platform.OS === "ios" ? 50 : 70,
  },
  card: {
    margin: 20,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
});
