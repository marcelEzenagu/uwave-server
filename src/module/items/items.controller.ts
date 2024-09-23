import { Controller,Query, Get, Post, BadRequestException,Body, Patch, Param, Delete } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';
import { FileService } from 'src/helpers/upload';

@Controller('items')
export class ItemsController {
  constructor(
    private readonly itemsService: ItemsService,
    private readonly fileService: FileService) {}

  @Post()
  async create(@Body() createItemDto: Item) { 
    
    if(createItemDto.images){
      const vPath = "public/images/items"
      const productImages :string[] = []
      const imagePath = `${vPath}/${createItemDto.itemName}`
      for(let i= 0; i < createItemDto.images.length; i++){
        const imageName =`${createItemDto.itemName}-${i}.png`
        await this.fileService.uploadImage(createItemDto.images[i],imagePath,imageName)
        
        const itemImage = `${imagePath}/${imageName}`
        productImages.push(itemImage)

      }
      
      createItemDto.images = productImages
    }
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
