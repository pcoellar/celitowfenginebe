import { Injectable } from '@nestjs/common';
import { IScriptRepositoryService } from 'src/wfdefinition/data-acces-layer/repositories/interfaces/script-repository.interface';
import { IDeleteScriptService } from '../interfaces/script/delete-script.interface';

@Injectable()
export class DeleteScriptService implements IDeleteScriptService {
  constructor(
    private readonly scriptRespositoryService: IScriptRepositoryService,
  ) {}
  async execute(id: string) {
    await this.scriptRespositoryService.delete(id);
  }
}
