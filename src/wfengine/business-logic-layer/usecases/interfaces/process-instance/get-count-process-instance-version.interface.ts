import { ProcessInstancesVersionCountResponseDto } from 'src/wfengine/entities/dto-entities/process-instances-version-count-response.dto.entity';

export abstract class IGetCountProcessInstanceVersionService {
  abstract execute(
    processVersionId: string,
  ): Promise<ProcessInstancesVersionCountResponseDto>;
}
