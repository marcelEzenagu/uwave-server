import { Controller,Query, Get, Post, BadRequestException,Body, Patch, Param, Delete } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  create(@Body() createItemDto: Item) {      
      return this.itemsService.create(createItemDto);

  }

  @Get()
  findAll(
    @Query('subCategory') subCategory?: string,
    @Query('category') category?: string
  ) {

    let where :any = {}

    if (category)where.productCategory = category.toLowerCase()
    if(subCategory)where.productSubCategory = subCategory.toLowerCase()
    return this.itemsService.findAll(where);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemsService.update(+id, updateItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsService.remove(+id);
  }
}
