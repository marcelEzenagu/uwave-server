import { Test, TestingModule } from '@nestjs/testing';
import { UWaveAdminService } from './u-wave-admin.service';

describe('UWaveAdminService', () => {
  let service: UWaveAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UWaveAdminService],
    }).compile();

    service = module.get<UWaveAdminService>(UWaveAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
