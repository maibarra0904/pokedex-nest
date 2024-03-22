import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    
    if(!isValidObjectId(value)){
      console.log(metadata)
      throw new BadRequestException(`${value} is not a valid MongoId`);
    }

    return value;
  }
}
