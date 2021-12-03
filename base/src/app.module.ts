import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { imports } from './module-imports';

@Module({ imports, providers: [AppService] })
export class AppModule { }