import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AirQualityService } from "./air-quality.service";
import { GetAirQualityDto } from "./dto/get-air-quality.dto";
import { AirQualityData } from "../common/interfaces/air-quality.interface";

@ApiTags("air-quality")
@Controller("air-quality")
export class AirQualityController {
  constructor(private readonly airQualityService: AirQualityService) {}

  @Get()
  @ApiOperation({ summary: "현재 위치의 대기질 정보 조회" })
  @ApiResponse({
    status: 200,
    description: "대기질 정보를 성공적으로 조회했습니다.",
    type: AirQualityData,
  })
  async getAirQuality(
    @Query() query: GetAirQualityDto
  ): Promise<AirQualityData> {
    return this.airQualityService.getAirQuality(
      query.latitude,
      query.longitude
    );
  }
}
