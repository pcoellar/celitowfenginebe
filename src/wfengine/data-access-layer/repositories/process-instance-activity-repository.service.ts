import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditableFieldsManager } from 'src/common/business-logic-layer/services/audit/utils';
import { ProcessInstanceActivityEntity } from 'src/wfengine/entities/data-entities/process-instance-activity.data.entity';
import { IProcessInstanceActivityRepositoryService } from './interfaces/process-instance-activity-repository.interface';

@Injectable()
export class ProcessInstanceActivityRepositoryService
  implements IProcessInstanceActivityRepositoryService
{
  constructor(
    @InjectRepository(ProcessInstanceActivityEntity)
    private readonly entityRepository: Repository<ProcessInstanceActivityEntity>,
  ) {}

  async findAll(
    relations?: string[],
  ): Promise<ProcessInstanceActivityEntity[]> {
    const entities: ProcessInstanceActivityEntity[] =
      await this.entityRepository.find({
        relations: relations ?? [],
      });
    return entities;
  }

  async findByFilter(
    filter: any,
    relations?: string[],
  ): Promise<ProcessInstanceActivityEntity[]> {
    try {
      return await this.entityRepository.find({
        where: filter,
        relations: relations ?? [],
      });
    } catch (error) {
      console.log('Error: ', error);
      return [];
    }
  }

  async find(
    id: string,
    relations?: string[],
  ): Promise<ProcessInstanceActivityEntity> {
    try {
      return await this.entityRepository.findOne({
        where: { id },
        relations: relations ?? [],
      });
    } catch {
      throw new NotFoundException();
    }
  }

  async create(
    entity: ProcessInstanceActivityEntity,
  ): Promise<ProcessInstanceActivityEntity> {
    const auditableFieldsManager = new AuditableFieldsManager();
    entity = auditableFieldsManager.IncludeAuditableFieldsOnCreate(entity);
    const data = this.entityRepository.create(entity);
    const result = await this.entityRepository.save(data);
    return result;
  }

  async update(
    entity: Partial<ProcessInstanceActivityEntity>,
  ): Promise<ProcessInstanceActivityEntity> {
    const auditableFieldsManager = new AuditableFieldsManager();
    entity = auditableFieldsManager.IncludeAuditableFieldsOnUpdate(entity);
    let entityToModify: ProcessInstanceActivityEntity = await this.find(
      entity.id,
    );
    if (!entityToModify) {
      throw new NotFoundException();
    }
    entityToModify = {
      ...entityToModify,
      ...entity,
    };
    const result: ProcessInstanceActivityEntity =
      await this.entityRepository.save(entityToModify);
    return result;
  }
}
