import { Controller, Get,Query, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ProductCategoryService } from '../product-category/product-category.service';
import { ProductSubCategoryService } from '../product-sub-category/product-sub-category.service';
import { ProductCategory } from '../product-category/entities/product-category.entity';
import { ProductSubCategory } from '../product-sub-category/entities/product-sub-category.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly category: ProductCategoryService,
    private readonly subCategory: ProductSubCategoryService

  ) {}


 // categories
  //add, edit, delete List
  @Post("categories")
  createCategory(@Body() createAdminDto: ProductCategory) {
    return this.category.create(createAdminDto);
  }

  @Patch("categories/:id")
  updateCategory(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.category.update(id, updateAdminDto);
  }

  @Get("categories")
  findAllCategories() {

    let where :any = {}
     where={"deletedAt":null}

    return this.category.findAll(where);
  }

  @Delete("categories/:id")
  removeCategory(@Param('id') id: string) {
    const where ={"_id":id}
    return this.category.remove(where);
  }


  // updates



  @Patch("sub-categories/:id")
  updateSubCategory(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.subCategory.update(id, updateAdminDto);
  }


  
  // Subcategories
  //add, edit, delete List
  @Post("sub-categories")
  createSubCategory(@Body() createAdminDto: ProductSubCategory) {
    return this.subCategory.create(createAdminDto);
  }

  @Get("sub-categories")
  findAllSubCategory(

    @Query('category') category?: string

  ) {

    let where :any = {}
    where={"deletedAt":null}
    if(category)where.productCategory = category.toLowerCase()

    return this.subCategory.findAll(where);
  }

 
 

  @Delete("sub-categories/:id")
  removeSubCategory(@Param('id') id: string) {
    const where ={"_id":id}

    return this.subCategory.remove(where);
  }

  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }
  

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

 
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }

 
}
