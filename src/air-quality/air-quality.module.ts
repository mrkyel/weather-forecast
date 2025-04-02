import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { AirQualityController } from "./air-quality.controller";
import { AirQualityService } from "./air-quality.service";

@Module({
  imports: [ConfigModule, ScheduleModule.forRoot()],
  controllers: [AirQualityController],
  providers: [AirQualityService],
})
export class AirQualityModule {}
