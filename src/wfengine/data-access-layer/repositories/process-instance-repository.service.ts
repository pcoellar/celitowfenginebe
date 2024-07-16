import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditableFieldsManager } from 'src/common/business-logic-layer/services/audit/utils';
import { IProcessInstanceRepositoryService } from './interfaces/process-instance-repository.interface';
import { ProcessInstanceEntity } from 'src/wfengine/entities/data-entities/process-instance.data.entity';
import { IEngineEventService } from 'src/wfengine/business-logic-layer/services/workflow/interfaces/engine-event.interface';
import { EventInfoInstanceParser } from 'src/wfengine/entities/service-entities/workflow/parsers/event-info-instance.dto.parser';
import { EventInfoInstance } from 'src/wfengine/entities/service-entities/workflow/event-info-instance.entity';
import { EventTypes } from 'src/wfengine/entities/enums/event-types.enum';

@Injectable()
export class ProcessInstanceRepositoryService
  implements IProcessInstanceRepositoryService
{
  constructor(
    @InjectRepository(ProcessInstanceEntity)
    private readonly entityRepository: Repository<ProcessInstanceEntity>,
    private readonly engineEventService: IEngineEventService,
  ) {}

  async findAll(relations?: string[]): Promise<ProcessInstanceEntity[]> {
    const entities: ProcessInstanceEntity[] = await this.entityRepository.find({
      relations: relations ?? [],
    });
    return entities;
  }

  async findByFilter(
    filter: any,
    relations?: string[],
  ): Promise<ProcessInstanceEntity[]> {
    try {
      return await this.entityRepository.find({
        where: filter,
        relations: relations ?? [],
      });
    } catch {
      throw new NotFoundException();
    }
  }

  async find(id: string, relations?: string[]): Promise<ProcessInstanceEntity> {
    try {
      return await this.entityRepository.findOne({
        where: { id },
        relations: relations ?? [],
      });
    } catch {
      throw new NotFoundException();
    }
  }

  async create(entity: ProcessInstanceEntity): Promise<ProcessInstanceEntity> {
    const auditableFieldsManager = new AuditableFieldsManager();
    entity = auditableFieldsManager.IncludeAuditableFieldsOnCreate(entity);
    const data = this.entityRepository.create(entity);
    const result = await this.entityRepository.save(data);

    const eventInfoInstanceParser = new EventInfoInstanceParser();
    const eventInfoInstance: EventInfoInstance =
      eventInfoInstanceParser.ParseToEventInfoInstance(result);
    this.engineEventService.Publish(
      EventTypes.OnInstanceCreated,
      eventInfoInstance,
    );

    return result;
  }

  async update(
    entity: Partial<ProcessInstanceEntity>,
  ): Promise<ProcessInstanceEntity> {
    const auditableFieldsManager = new AuditableFieldsManager();
    entity = auditableFieldsManager.IncludeAuditableFieldsOnUpdate(entity);
    let entityToModify: ProcessInstanceEntity = await this.find(entity.id);
    if (!entityToModify) {
      throw new NotFoundException();
    }
    entityToModify = {
      ...entityToModify,
      ...entity,
    };
    const result: ProcessInstanceEntity =
      await this.entityRepository.save(entityToModify);

    const eventInfoInstanceParser = new EventInfoInstanceParser();
    const eventInfoInstance: EventInfoInstance =
      eventInfoInstanceParser.ParseToEventInfoInstance(result);
    this.engineEventService.Publish(
      EventTypes.OnInstanceUpdated,
      eventInfoInstance,
    );

    return result;
  }
}
