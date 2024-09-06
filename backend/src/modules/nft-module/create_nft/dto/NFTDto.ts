import { IsString, IsNotEmpty } from 'class-validator';
import { MemoryStoredFile, IsFile, MaxFileSize, HasMimeType } from 'nestjs-form-data';

export class NftDto {
  @IsFile()
  //@MaxFileSize(10e6) // 10MB
  @HasMimeType(['image/jpeg', 'image/png'])
  @IsNotEmpty()
  file: MemoryStoredFile;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  metadata: string;

  @IsString()
  @IsNotEmpty()
  userID: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}