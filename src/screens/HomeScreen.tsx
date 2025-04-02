import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useLocation } from "../hooks/useLocation";
import { useAirQuality } from "../hooks/useAirQuality";

export const HomeScreen = () => {
  const {
    location,
    loading: locationLoading,
    error: locationError,
  } = useLocation();
  const {
    airQuality,
    loading: airQualityLoading,
    error: airQualityError,
  } = useAirQuality(location);

  if (locationLoading || airQualityLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (locationError || airQualityError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{locationError || airQualityError}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{airQuality?.sidoName || "서울"}</Text>

        {/* 미세먼지 카드 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>현재 미세먼지</Text>
          <Text style={styles.value}>
            {airQuality?.warningMessage || "좋음"}
          </Text>
          <Text style={styles.unit}>{airQuality?.pm10Value || 0} μg/m³</Text>
        </View>

        {/* 초미세먼지 카드 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>현재 초미세먼지</Text>
          <Text style={styles.value}>
            {airQuality?.warningMessage || "좋음"}
          </Text>
          <Text style={styles.unit}>{airQuality?.pm25Value || 0} μg/m³</Text>
        </View>

        {/* 날씨 카드 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>오늘의 날씨</Text>
          <View style={styles.weatherRow}>
            <Text style={styles.temperature}>
              {airQuality?.temperature || 0}°
            </Text>
            <Text style={styles.weatherDesc}>
              {airQuality?.weatherDescription || "맑음"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 16,
    paddingTop: 24,
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1f2937",
  },
  card: {
    marginTop: 24,
    padding: 24,
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    color: "#4b5563",
    textAlign: "center",
  },
  value: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#3b82f6",
    textAlign: "center",
    marginTop: 8,
  },
  unit: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 4,
  },
  weatherRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  temperature: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
  },
  weatherDesc: {
    fontSize: 16,
    color: "#6b7280",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 16,
    textAlign: "center",
    padding: 16,
  },
});
