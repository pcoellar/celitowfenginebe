import { Injectable } from '@nestjs/common';
import { IDeleteScriptService } from '../interfaces/script/delete-script.interface';
import { IScriptRepositoryService } from 'src/wfengine/data-access-layer/repositories/interfaces/script-repository.interface';

@Injectable()
export class DeleteScriptService implements IDeleteScriptService {
  constructor(
    private readonly scriptRespositoryService: IScriptRepositoryService,
  ) {}
  async execute(id: string) {
    await this.scriptRespositoryService.delete(id);
  }
}
