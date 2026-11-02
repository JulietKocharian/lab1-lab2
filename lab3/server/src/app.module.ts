import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConvertController } from './convert.controller';
import { ConvertService } from './convert.service';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      renderPath: '/',
      exclude: ['/health', '/convert'],
      serveStaticOptions: {
        fallthrough: true,
        index: 'index.html',
      },
    }),
  ],
  controllers: [HealthController, ConvertController],
  providers: [ConvertService],
})
export class AppModule {}
