import { Test, TestingModule } from '@nestjs/testing';
import { JobSeekerService } from './jobseeker.service';

describe('JobseekerService', () => {
  let service: JobSeekerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobSeekerService],
    }).compile();

    service = module.get<JobSeekerService>(JobSeekerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
