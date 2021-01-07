import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  DNSHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HealthCheckResult,
} from '@nestjs/terminus';
import { HealthService } from './health.service';
import { HealthDto } from './health.dto';

@ApiTags('Health')
@Controller()
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private dns: DNSHealthIndicator,
    private healthService: HealthService,
  ) {}

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

  @ApiOperation({
    summary: 'Check dns',
    description: 'Send a GET-request to the https://google.com',
  })
  @ApiResponse({ status: HttpStatus.OK })
  @Get('/health/dns')
  @HealthCheck()
  async getCheckDns(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.dns.pingCheck('google', 'https://google.com'),
    ]);
  }
}
