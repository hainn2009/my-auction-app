import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller()
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @MessagePattern('createItem')
  create(@Payload() createItemDto: CreateItemDto) {
    return this.itemsService.create(createItemDto);
  }

  @MessagePattern('findAllItems')
  findAll() {
    return this.itemsService.findAll();
  }

  @MessagePattern('findOneItem')
  findOne(@Payload() id: number) {
    return this.itemsService.findOne(id);
  }

  @MessagePattern('updateItem')
  update(@Payload() updateItemDto: UpdateItemDto) {
    return this.itemsService.update(updateItemDto.id, updateItemDto);
  }

  @MessagePattern('removeItem')
  remove(@Payload() id: number) {
    return this.itemsService.remove(id);
  }
}
