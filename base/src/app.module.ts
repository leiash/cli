import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { imports } from './module-imports';

@Module({
    imports: [
        ConfigModule.forRoot(),
        EventEmitterModule.forRoot(),
        MongooseModule.forRootAsync({
            imports: [ConfigModule.forRoot()],
            useFactory: async () => {
                return {
                    uri: process.env.MONGO_URL,
                    tlsAllowInvalidCertificates: true
                }
            }
        }),
        ...imports
    ],
    providers: [AppService]
})
export class AppModule { }