import { Test, TestingModule } from '@nestjs/testing';
import { InterviewPrepService } from './interview-prep.service';

describe('InterviewPrepService', () => {
  let service: InterviewPrepService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InterviewPrepService],
    }).compile();

    service = module.get<InterviewPrepService>(InterviewPrepService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
