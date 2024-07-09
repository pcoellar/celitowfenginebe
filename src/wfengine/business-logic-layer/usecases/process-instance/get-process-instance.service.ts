import { Injectable } from '@nestjs/common';
import { IGetProcessInstanceService } from '../interfaces/process-instance/get-process-instance.interface';
import { IProcessInstanceRepositoryService } from 'src/wfengine/data-access-layer/repositories/interfaces/process-instance-repository.interface';
import { ProcessInstanceResponseDto } from 'src/wfengine/entities/dto-entities/process-instance-response.dto.entity';
import { ProcessInstanceEntity } from 'src/wfengine/entities/data-entities/process-instance.data.entity';
import { ProcessInstanceResponseParser } from 'src/wfengine/entities/dto-entities/parsers/process-instance-response.dto.parse';

@Injectable()
export class GetProcessInstanceService implements IGetProcessInstanceService {
  constructor(
    private readonly processInstanceRepositoryService: IProcessInstanceRepositoryService,
  ) {}
  async execute(id: string): Promise<ProcessInstanceResponseDto> {
    const processInstance: ProcessInstanceEntity =
      await this.processInstanceRepositoryService.find(id);
    const getProcessInstanceResponseParser =
      new ProcessInstanceResponseParser();
    const result: ProcessInstanceResponseDto =
      getProcessInstanceResponseParser.ParseToProcessInstanceResponseDto(
        processInstance,
      );
    return result;
  }
}
