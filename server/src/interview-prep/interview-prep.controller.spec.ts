import { Test, TestingModule } from '@nestjs/testing';
import { InterviewPrepController } from './interview-prep.controller';

describe('InterviewPrepController', () => {
  let controller: InterviewPrepController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InterviewPrepController],
    }).compile();

    controller = module.get<InterviewPrepController>(InterviewPrepController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
