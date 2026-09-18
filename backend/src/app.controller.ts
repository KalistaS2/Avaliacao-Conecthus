import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

/**
 * Controller principal para verificação de status e saúde da API (Healthcheck).
 */
@ApiTags('Status')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Endpoint de teste/healthcheck da API.
   * @returns Retorna mensagem de saudação indicando status online.
   */
  @Get()
  @ApiOperation({ summary: 'Verificar status da API', description: 'Retorna mensagem indicando que o servidor backend está operacional.' })
  @ApiResponse({ status: 200, description: 'API em funcionamento.' })
  getHello(): string {
    return this.appService.getHello();
  }
}
