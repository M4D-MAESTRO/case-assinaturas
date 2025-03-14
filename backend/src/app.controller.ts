import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as swaggerStats from 'swagger-stats';
import * as prom from 'prom-client';
import { Public } from './config/public-endpoint.config';


class SystemInfoDto {
  @ApiProperty({ description: "Nome da API", example: "API - Nome da API" })
  api: string;

  @ApiProperty({ description: "Ambiente da API", example: "production" })
  env: string;

  @ApiProperty({ description: "Versão da API", example: "1.0.0" })
  version: string;

  @ApiProperty({ description: "Status da API", example: "UP" })
  status: string;
}


@ApiTags('API')
@Controller()
export class AppController {

  constructor() { }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Retorna informações básicas sobre o sistema e ambiente' })
  @ApiResponse({ status: 200, isArray: false, type: SystemInfoDto })
  async getSystemInfo() {
    return {
      api: `${process.env.SYSTEM_NICKNAME} - ${process.env.SYSTEM_NAME}`,
      env: process.env.MODE,
      version: process.env.SYSTEM_VERSION,
      status: 'UP',
    }
  }
  
}
