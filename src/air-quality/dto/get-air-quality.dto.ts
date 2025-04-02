import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsLatitude, IsLongitude } from "class-validator";
import { Type } from "class-transformer";

export class GetAirQualityDto {
  @ApiProperty({
    description: "위도",
    example: 37.4119219,
  })
  @IsLatitude()
  @IsNumber()
  @Type(() => Number)
  latitude: number;

  @ApiProperty({
    description: "경도",
    example: 127.0924984,
  })
  @IsLongitude()
  @IsNumber()
  @Type(() => Number)
  longitude: number;
}
