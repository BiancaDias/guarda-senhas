import { Controller } from '@nestjs/common';
import { EraseService } from './erase.service';

@Controller('erase')
export class EraseController {
  constructor(private readonly eraseService: EraseService) {}
}
