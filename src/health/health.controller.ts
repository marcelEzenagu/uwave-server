import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
    @Get()
    checkHealth(): object {
        return {
            status: 'ok',
            uptime: process.uptime(),
            timestamp: new Date(),
            database: 'connected', // You would implement actual checks here
        };
    }
}
