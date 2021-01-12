import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';
import { HealthDto } from './health.dto';

@ApiTags('Health')
@Controller()
export class HealthController {
  constructor(private healthService: HealthService) {}

  @ApiOperation({
    summary: 'Ok',
    description: 'Help endpoint to know if the service is operational',
  })
  @ApiResponse({ status: HttpStatus.OK, type: String })
  @Get()
  getOk(): string {
    return this.healthService.getOk();
  }

  @ApiOperation({
    summary: 'Health',
    description: 'Endpoint displaying information about the microservice',
  })
  @ApiResponse({ status: HttpStatus.OK, type: HealthDto })
  @Get('/health')
  getHealthCheck(): HealthDto {
    return this.healthService.getHealthCheck();
  }
}
