import { Module, Global } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

@Global() // 👈 Quan trọng: Để dùng được ở mọi nơi
@Module({
  providers: [EventsGateway],
  exports: [EventsGateway], // Export để module khác inject được
})
export class EventsModule { }