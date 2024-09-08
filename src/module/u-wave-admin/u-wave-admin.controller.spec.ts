import { Test, TestingModule } from '@nestjs/testing';
import { UWaveAdminController } from './u-wave-admin.controller';
import { UWaveAdminService } from './u-wave-admin.service';

describe('UWaveAdminController', () => {
  let controller: UWaveAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UWaveAdminController],
      providers: [UWaveAdminService],
    }).compile();

    controller = module.get<UWaveAdminController>(UWaveAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
