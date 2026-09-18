import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';

dotenv.config();

/**
 * Função de inicialização e bootstrapping da aplicação NestJS.
 * Configura pipes globais de validação, CORS, Swagger UI e inicializa o servidor HTTP.
 * @returns Promise sem retorno direto (executa o servidor).
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para permitir requisições do frontend Angular
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Habilitar pipe de validação de DTOs globalmente
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Configuração do Swagger UI para documentação interativa da API REST
  const config = new DocumentBuilder()
    .setTitle('API RESTful - Conecthus CRUD')
    .setDescription('Documentação dos endpoints REST da aplicação de gerenciamento de usuários Conecthus.')
    .setVersion('1.0')
    .addTag('Usuários')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Servidor backend rodando na porta ${port}`);
  console.log(`📄 Swagger UI disponível em http://localhost:${port}/api/docs`);
}

bootstrap();
