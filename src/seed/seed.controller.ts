import { Controller, Delete, Get, Param } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  
  constructor(private readonly seedService: SeedService) {}

  @Get()
  executeSeed() {
    return this.seedService.executeSeed();
  }

  @Get(':n')
  executeSpecificSeed(@Param('n') n: number) {
    return this.seedService.executeSpecificSeed(n);
  }

  @Delete()
  deleteAllSeed() {
    return this.seedService.deleteAllSeed();
  }

}
