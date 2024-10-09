import { Controller, Get,Query, Post, Body, Patch, Param, Delete, Req, BadRequestException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ProductCategoryService } from '../product-category/product-category.service';
import { ProductSubCategoryService } from '../product-sub-category/product-sub-category.service';
import { ProductCategory } from '../product-category/entities/product-category.entity';
import { ProductSubCategory } from '../product-sub-category/entities/product-sub-category.entity';
import { ApiTags } from '@nestjs/swagger';
import { FreightService } from '../freight/freight.service';
import { Request } from 'express';
import { ErrorFormat } from 'src/helpers/errorFormat';
import { Freight } from '../freight/entities/freight.entity';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private  errorFormat: ErrorFormat,

    private readonly category: ProductCategoryService,
    private readonly subCategory: ProductSubCategoryService,
    private readonly shipmentService: FreightService

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
  

 
 
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
  
  // freight
  @Patch('shipments/:id')  // Updated the route from 'wave/shipments/:id' to 'shipments/:id'
  async adminUpdateFreight(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() dto :Freight,
  ) {
    try {
      
    
    const role = req['user'].role
    const userType = req['user'].sub


    if(role !="admin" || userType != "isAdmin"){
      throw new BadRequestException("unaccessible");
    }

    return await this.shipmentService.adminUpdate(id,dto);
  } catch (e) {
    console.log("eRROR @controlelr",e)
    throw new BadRequestException(this.errorFormat.formatErrors(e))
  }
  }
  
  @Get('shipments/')  // Updated the route from 'wave/shipments/:id' to 'shipments/:id'
  async adminFindAll(
    @Req() req: Request,
  ) {
    try {    
    const role = req['user'].role
    const userType = req['user'].sub

    if(role !="admin" || userType != "isAdmin"){
      throw new BadRequestException("unaccessible");
    }

    return await this.shipmentService.adminFindAll();
    
  } catch (e) {
    console.log("eRROR @controlelr",e)
    throw new BadRequestException(this.errorFormat.formatErrors(e))
  }
  }


  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }


 
}
