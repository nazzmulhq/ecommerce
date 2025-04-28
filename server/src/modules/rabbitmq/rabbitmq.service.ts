// src/rabbitmq/rabbitmq.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RabbitmqService {
    constructor(
        @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
    ) {}

    async sendMessage<T>(pattern: string, data: T): Promise<any> {
        return firstValueFrom(this.client.send(pattern, data));
    }

    async emitEvent<T>(pattern: string, data: T): Promise<void> {
        await firstValueFrom(this.client.emit(pattern, data));
    }
}
