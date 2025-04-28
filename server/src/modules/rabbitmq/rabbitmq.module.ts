// src/rabbitmq/rabbitmq.module.ts
import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitmqService } from './rabbitmq.service';

@Global()
@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'RABBITMQ_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: ['amqp://localhost:5672'], // <- Change this if needed
                    queue: 'main_queue',
                    queueOptions: {
                        durable: false,
                    },
                },
            },
        ]),
    ],
    providers: [RabbitmqService],
    exports: [RabbitmqService],
})
export class RabbitmqModule {}
