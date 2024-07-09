import { Injectable } from '@nestjs/common';
import { IGetAllProcessInstanceActivityService } from '../interfaces/process-instance-activity/get-all-process-instance.interface';
import { IProcessInstanceActivityRepositoryService } from 'src/wfengine/data-access-layer/repositories/interfaces/process-instance-activity-repository.interface';
import { ProcessInstanceActivityResponseDto } from 'src/wfengine/entities/dto-entities/process-instance-activity-response.dto.entity';
import { ProcessInstanceActivityEntity } from 'src/wfengine/entities/data-entities/process-instance-activity.data.entity';
import { ProcessInstanceActivityResponseParser } from 'src/wfengine/entities/dto-entities/parsers/process-instance-activity-response.dto.parse';

@Injectable()
export class GetAllProcessInstanceActivityService
  implements IGetAllProcessInstanceActivityService
{
  constructor(
    private readonly processInstanceActivityRepositoryService: IProcessInstanceActivityRepositoryService,
  ) {}
  async execute(): Promise<ProcessInstanceActivityResponseDto[]> {
    const processInstanceActivityEntities: ProcessInstanceActivityEntity[] =
      await this.processInstanceActivityRepositoryService.findAll();
    const result: ProcessInstanceActivityResponseDto[] = [];
    for (let i = 0; i < processInstanceActivityEntities.length; i++) {
      const getProcessInstanceActivityResponseParser =
        new ProcessInstanceActivityResponseParser();
      const processInstanceActivityResponseDto =
        getProcessInstanceActivityResponseParser.ParseToProcessInstanceActivityResponseDto(
          processInstanceActivityEntities[i],
        );
      result.push(processInstanceActivityResponseDto);
    }
    return result;
  }
}
