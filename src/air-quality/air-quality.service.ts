import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Cron, CronExpression } from "@nestjs/schedule";
import Redis from "ioredis";
import axios from "axios";
import * as cheerio from "cheerio";
import {
  AirQualityData,
  Station,
} from "../common/interfaces/air-quality.interface";

@Injectable()
export class AirQualityService {
  private readonly logger = new Logger(AirQualityService.name);
  private readonly redis: Redis;
  private readonly CACHE_KEY_PREFIX = "air_quality:";
  private readonly NAVER_WEATHER_URL = "https://m.weather.naver.com/air";

  constructor(private readonly configService: ConfigService) {
    this.redis = new Redis(this.configService.get("redis.url"));
  }

  private getCacheKey(latitude: number, longitude: number): string {
    // 위치를 0.01도 단위로 반올림하여 캐시 키 생성
    const roundedLat = Math.round(latitude * 100) / 100;
    const roundedLon = Math.round(longitude * 100) / 100;
    return `${this.CACHE_KEY_PREFIX}${roundedLat}:${roundedLon}`;
  }

  async getAirQuality(
    latitude: number,
    longitude: number
  ): Promise<AirQualityData> {
    const cacheKey = this.getCacheKey(latitude, longitude);

    // 캐시 확인
    const cachedData = await this.redis.get(cacheKey);
    if (cachedData) {
      this.logger.debug(`Cache hit for ${cacheKey}`);
      return JSON.parse(cachedData);
    }

    // 캐시가 없으면 새로운 데이터 가져오기
    const data = await this.fetchAirQualityData(latitude, longitude);

    // 캐시에 저장
    await this.redis.set(
      cacheKey,
      JSON.stringify(data),
      "EX",
      this.configService.get("cache.ttl")
    );

    return data;
  }

  private async fetchAirQualityData(
    latitude: number,
    longitude: number
  ): Promise<AirQualityData> {
    try {
      const url = `${this.NAVER_WEATHER_URL}/${latitude},${longitude}`;
      const response = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
        },
      });

      const $ = cheerio.load(response.data);

      // 미세먼지(PM10) 데이터 파싱
      const pm10Value = $(".air_info .value").first().text().trim();
      const pm10 = parseInt(pm10Value) || 0;

      // 초미세먼지(PM2.5) 데이터 파싱
      const pm25Value = $(".air_info .value").eq(1).text().trim();
      const pm25 = parseInt(pm25Value) || 0;

      // 측정소 위치 파싱
      const location = $(".location_name").text().trim();

      // 측정 시간 파싱
      const timestamp =
        $(".summary_time").text().trim() || new Date().toISOString();

      return {
        pm10,
        pm25,
        location: location || "알 수 없음",
        timestamp,
      };
    } catch (error) {
      this.logger.error("Error fetching air quality data:", error);
      throw error;
    }
  }

  @Cron(CronExpression.EVERY_15_MINUTES)
  async clearOldCache() {
    try {
      const keys = await this.redis.keys(`${this.CACHE_KEY_PREFIX}*`);
      if (keys.length > 0) {
        const pipeline = this.redis.pipeline();
        keys.forEach((key) => {
          pipeline.ttl(key).then((ttl) => {
            if (ttl <= 0) {
              this.redis.del(key);
              this.logger.debug(`Cleared expired cache: ${key}`);
            }
          });
        });
        await pipeline.exec();
      }
    } catch (error) {
      this.logger.error("Error clearing old cache:", error);
    }
  }
}
