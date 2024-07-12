import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditableFieldsManager } from 'src/common/business-logic-layer/services/audit/utils';
import { IProcessInstanceRepositoryService } from './interfaces/process-instance-repository.interface';
import { ProcessInstanceEntity } from 'src/wfengine/entities/data-entities/process-instance.data.entity';

@Injectable()
export class ProcessInstanceRepositoryService
  implements IProcessInstanceRepositoryService
{
  constructor(
    @InjectRepository(ProcessInstanceEntity)
    private readonly entityRepository: Repository<ProcessInstanceEntity>,
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
    return result;
  }
}
