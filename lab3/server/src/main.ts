import 'reflect-metadata';
import { existsSync, statSync } from 'fs';
import { join, normalize, sep } from 'path';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { ValidationError } from 'class-validator';
import type { NextFunction, Request, Response } from 'express';
import { AppModule } from './app.module';

function flattenErrors(errors: ValidationError[]): string[] {
  const messages: string[] = [];
  for (const error of errors) {
    if (error.constraints) {
      messages.push(...Object.values(error.constraints));
    }
    if (error.children?.length) {
      messages.push(...flattenErrors(error.children));
    }
  }
  return messages;
}

function resolveAsset(publicDir: string, urlPath: string): string | null {
  const decoded = decodeURIComponent(urlPath);
  const cleaned = normalize(decoded).replace(/^(\.\.(?:\/|\\|$))+/, '');
  const assetPath = join(publicDir, cleaned);
  const root = publicDir.endsWith(sep) ? publicDir : publicDir + sep;
  if (assetPath !== publicDir && !assetPath.startsWith(root)) {
    return null;
  }
  if (!existsSync(assetPath) || !statSync(assetPath).isFile()) {
    return null;
  }
  return assetPath;
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = [...new Set(flattenErrors(errors))];
        return new BadRequestException(
          messages.join(' ') || 'A required value is missing or out of range.',
        );
      },
    }),
  );

  const publicDir = join(__dirname, '..', 'public');
  const indexPath = join(publicDir, 'index.html');

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      next();
      return;
    }
    if (req.path === '/api' || req.path.startsWith('/api/')) {
      next();
      return;
    }

    let asset: string | null = null;
    if (req.path !== '/') {
      try {
        asset = resolveAsset(publicDir, req.path);
      } catch {
        res.status(400).type('text/plain; charset=utf-8').send('Bad path');
        return;
      }
    }
    if (asset) {
      res.sendFile(asset);
      return;
    }
    if (req.path.includes('.')) {
      res.status(404).type('text/plain; charset=utf-8').send('Not found');
      return;
    }
    if (!existsSync(indexPath)) {
      res.status(503).type('text/plain; charset=utf-8').send('The web app has not been built.');
      return;
    }
    res.sendFile(indexPath);
  });

  await app.listen(8000, '0.0.0.0');
}

void bootstrap();
