import { Module } from '@nestjs/common';
import { UWaveAdminService } from './u-wave-admin.service';
import { UWaveAdminController } from './u-wave-admin.controller';

@Module({
  controllers: [UWaveAdminController],
  providers: [UWaveAdminService],
})
export class UWaveAdminModule {}
