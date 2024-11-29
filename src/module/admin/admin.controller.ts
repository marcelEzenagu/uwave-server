import { Controller, Get,Query, Post, Body, Patch, Param, Delete, Req, BadRequestException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ProductCategoryService } from '../product-category/product-category.service';
import { ProductSubCategoryService } from '../product-sub-category/product-sub-category.service';
import { CategoryStatus, ProductCategory } from '../product-category/entities/product-category.entity';
import { ProductSubCategory } from '../product-sub-category/entities/product-sub-category.entity';
import { FreightService } from '../freight/freight.service';
import { Request } from 'express';
import { ErrorFormat } from 'src/helpers/errorFormat';
import { Freight } from '../freight/entities/freight.entity';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { VendorService } from '../vendor/vendor.service';
import { ItemsService } from '../items/items.service';
import { ItemStatus } from '../items/entities/item.entity';
import { OptionType } from '../order/entities/order.entity';
import { OrderService } from '../order/order.service';
import { AgentService } from '../agent/agent.service';
import { ProductService } from '../product/product.service';
import { ProductStatus } from '../product/entities/product.entity';
import { Agent } from '../agent/entities/agent.entity';
import { Vendor } from '../vendor/entities/vendor.entity';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { UpdateVendorDto } from '../vendor/dto/update-vendor.dto';
import { MailerService } from '../mailer/mailer.service';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {

  password :string

  constructor(
    private readonly adminService: AdminService,
    private  errorFormat: ErrorFormat,

    private readonly category: ProductCategoryService,
    private readonly subCategory: ProductSubCategoryService,
    private readonly shipmentService: FreightService,
    private readonly userService: UserService,
    private readonly vendorService: VendorService,
    private readonly itemService: ItemsService,
    private readonly orderService: OrderService,
    private readonly agentService: AgentService,
    private readonly productService: ProductService, 
    private emailService: MailerService,
   
  ) {
    this.password = "123@Password"
  }
 // categories
  //add, edit, delete List
  @Post("categories")
    createCategory(@Body() createAdminDto: ProductCategory,
    @Req() req: Request,
    ) {
    try {    
      const role = req['user'].role
      const userType = req['user'].sub
  
      if(role !="admin" || userType != "usave_admin"){
        throw new BadRequestException("unaccessible");
      }
    return this.category.create(createAdminDto);
  } catch (e) {
    console.log("eRROR @controlelr",e)
    throw new BadRequestException(this.errorFormat.formatErrors(e))
  }
  }

  @Patch('categories/:id')
  updateCategory(@Param('id') id: string,
  @Req() req: Request,
  @Body() updateAdminDto: UpdateAdminDto) {
   
    try {    
      const role = req['user'].role
      const userType = req['user'].sub
  
      if(role !="admin" || userType != "usave_admin"){
        throw new BadRequestException("unaccessible");
      }
    return this.category.update(id, updateAdminDto);
  } catch (e) {
    console.log("eRROR @controlelr",e)
    throw new BadRequestException(this.errorFormat.formatErrors(e))
  }
  }

  @Get("categories")
  // findAllCategories() {

  //   let where :any = {}
  //    where={}

  //   return this.category.findAll(where);
  // }

  // @Get('categories-search/')  
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search word for category search',
    type: String,
    example:"protein",
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'page for paginating category search',
    type: Number,
    example:1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'limit for category search',
    type: Number,
    example:50,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'status for category search',
    enum: CategoryStatus,
    example:CategoryStatus.ACTIVE,
  })
  async adminGetCategories(
    @Req() req: Request,
    @Query('search') search: string ,
    @Query('page') page: number = 1, 
    @Query('limit') limit: number = 50,
    @Query('status') status: CategoryStatus, 
  ) {
    try {    
      page = Number(page);
    limit = Number(limit);

    if (page < 1) page = 1;  // Page should be at least 1
    if (limit < 1 || limit > 100) limit = 100;  // Limit should be between 1 and 100


    const role = req['user'].role
    const userType = req['user'].sub
    console.log("userType:: ",userType)
    if(role !="admin" || userType != "usave_admin"){
      throw new BadRequestException("unaccessible");
    }
    return await this.category.adminSearchCategories(page,limit,status,search);
  } catch (e) {
    console.log("eRROR @controlelr",e)
    throw new BadRequestException(this.errorFormat.formatErrors(e))
  }
  }

  @Delete("categories/:id")
  async removeCategory(@Param('id') id: string,
  @Req() req: Request,
) {
    try {    
      const role = req['user'].role
      const userType = req['user'].sub
  
      if(role !="admin" || userType != "usave_admin"){
        throw new BadRequestException("unaccessible");
      }
    const where ={"_id":id}
    return await this.category.adminDelete(where);
  } catch (e) {
    console.log("eRROR @controlelr",e)
    throw new BadRequestException(this.errorFormat.formatErrors(e))
  }
  }


// subcategory
  @Patch("sub-categories/:id")
  updateSubCategory(@Param('id') id: string,
  @Req() req: Request,

  @Body() updateAdminDto: UpdateAdminDto) {
    try {    
      const role = req['user'].role
      const userType = req['user'].sub
  
      if(role !="admin" || userType != "usave_admin"){
        throw new BadRequestException("unaccessible");
      }
    return this.subCategory.update(id, updateAdminDto);
    } catch (e) {
      console.log("eRROR @controlelr",e)
      throw new BadRequestException(this.errorFormat.formatErrors(e))
    }
  }
  
  // Subcategories
  //add, edit, delete List
  @Post("sub-categories")
  async createSubCategory(@Body() createAdminDto: ProductSubCategory,
  @Req() req: Request,

) {

    try {    
    const role = req['user'].role
    const userType = req['user'].sub

    if(role !="admin" || userType != "usave_admin"){
      throw new BadRequestException("unaccessible");
    }
    return await this.subCategory.create(createAdminDto);
    } catch (e) {
      console.log("eRROR @controlelr",e)
      throw new BadRequestException(this.errorFormat.formatErrors(e))
    }
  }


  // @Get("sub-categories")
  // @ApiQuery({
  //   name: 'category',
  //   required: false,
  //   description: 'category for subCategory search',
  //   type : String,
  //   example:"protein",
  // })
  // async findAllSubCategory(
  //   @Req() req: Request,
  //   @Query('category') category?: string
  // ) {
  //   try {    
  //     const role = req['user'].role
  //     const userType = req['user'].sub
  
  //     if(role !="admin" || userType != "usave_admin"){
  //       throw new BadRequestException("unaccessible");
  //     }
  //   let where :any = {}
  //   where={"deletedAt":null}
  //   if(category)where.productCategory = category.toLowerCase()

  //   return await this.subCategory.findAll(where);
  // } catch (e) {
  //   console.log("eRROR @controlelr",e)
  //   throw new BadRequestException(this.errorFormat.formatErrors(e))
  // }
  // }


  @Get('sub-categories/')  
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search word for sub-category search',
    type: String,
    example:"protein",
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'page for paginating sub-category search',
    type: Number,
    example:1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'limit for sub-category search',
    type: Number,
    example:50,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'status for sub-category search',
    enum: CategoryStatus,
    example:CategoryStatus.ACTIVE,
  })
  async adminGetSubCategories(
    @Req() req: Request,
    @Query('page') page: number = 1, 
    @Query('limit') limit: number = 50,
    @Query('status') status: CategoryStatus, 
    @Query('search') search: string ,
  ) {
    try {    
      page = Number(page);
    limit = Number(limit);

    if (page < 1) page = 1;  // Page should be at least 1
    if (limit < 1 || limit > 100) limit = 10;  // Limit should be between 1 and 100


    const role = req['user'].role
    const userType = req['user'].sub
    if(role !="admin" || userType != "usave_admin"){
      throw new BadRequestException("unaccessible");
    }
    return await this.subCategory.adminSearchSubCategories(page,limit,status,search);
  } catch (e) {
    console.log("eRROR @controlelr",e)
    throw new BadRequestException(this.errorFormat.formatErrors(e))
  }
  }

 

  @Delete("sub-categories/:id")
  async removeSubCategory(@Param('id') id: string,
  @Req() req: Request,

) {
  try {    
    const role = req['user'].role
    const userType = req['user'].sub

    if(role !="admin" || userType != "usave_admin"){
      throw new BadRequestException("unaccessible");
    }
    const where ={"_id":id}

    return await this.subCategory.remove(where);
  } catch (e) {
    console.log("eRROR @controlelr",e)
    throw new BadRequestException(this.errorFormat.formatErrors(e))
  }
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
  


  // users
  @Get('users/')  // Updated the route from 'wave/shipments/:id' to 'shipments/:id'
  async adminFindUsers(
    @Req() req: Request,
  ) {
    try {    
    const role = req['user'].role
    const userType = req['user'].sub

    if(role !="admin" || userType != "usave_admin"){
      throw new BadRequestException("unaccessible");
    }

    return await this.userService.adminFindAll();
    
  } catch (e) {
    console.log("eRROR @controlelr",e)
    throw new BadRequestException(this.errorFormat.formatErrors(e))
  }
  }

  @Get('users/:id')  // Updated the route from 'wave/shipments/:id' to 'shipments/:id'
  async adminFindUser(
    @Req() req: Request,
    @Param('id') id:string
  ) {
    try {    
    const role = req['user'].role
    const userType = req['user'].sub

    if(role !="admin" || userType != "usave_admin"){
      throw new BadRequestException("unaccessible");
    }

     id = id.trim()
    return await this.userService.adminFindOne(id);
    
  } catch (e) {
    console.log("eRROR @controlelr",e)
    throw new BadRequestException(this.errorFormat.formatErrors(e))
  }
  }
  
  @Patch('users/:id')  // Updated the route from 'wave/shipments/:id' to 'shipments/:id'
    async adminUpdateUser(
      @Req() req: Request,
      @Param('id') id:string,
      @Body() updateUserDto: User
    ) {
      try {    
      const role = req['user'].role
      const userType = req['user'].sub

      if(role !="admin" || userType != "usave_admin"){
        throw new BadRequestException("unaccessible");
      }

      id = id.trim()
      return await this.userService.adminUpdate(id,updateUserDto);
      
    } catch (e) {
      console.log("eRROR @controlelr",e)
      throw new BadRequestException(this.errorFormat.formatErrors(e))
    }
  }

// vendors  

    @Get('vendors/')
    @ApiQuery({
      name: 'query',
      required: false,
      description: 'query word for vendor search',
      type: String,
      example:"sam",
    })
    @ApiQuery({
      name: 'page',
      required: false,
      description: 'page for paginating vendor search',
      type: Number,
      example:1,
    })
    @ApiQuery({
      name: 'limit',
      required: false,
      description: 'limit for vendor search',
      type: Number,
      example:50,
    })
    @ApiQuery({
      name: 'isDisabled',
      required: false,
      description: 'isDisabled for vendor search',
      type: Boolean,
      example:false,
    })  
    async adminListVendors(
      @Req() req: Request,
      @Query('query') query: string, 
      @Query('isDisabled') isDisabled: boolean, 
      @Query('page') page: number = 1, 
      @Query('limit') limit: number = 50 
    ) {
      try {    
        console.log("got called isDisabled",isDisabled)
      const role = req['user'].role
      const userType = req['user'].sub
      if(role !="admin" || userType != "usave_admin"){
        throw new BadRequestException("unaccessible");
      }
      return await this.vendorService.adminFindAll(page,limit,query,isDisabled)

    } catch (e) {
      console.log("eRROR @controlelr",e)
      throw new BadRequestException(this.errorFormat.formatErrors(e))
    }
  }

    @Post('vendors/')  
    async adminCreateVendors(
      @Req() req: Request,
      @Body() dto:Vendor, 
    ) {
      try {    

        dto.password = this.password

      const role = req['user'].role
      const userType = req['user'].sub
      if(role !="admin" || userType != "usave_admin"){
        throw new BadRequestException("unaccessible");
      }


      return await this.vendorService.create(dto);

    } catch (e) {
      console.log("eRROR @controlelr",e)
      throw new BadRequestException(this.errorFormat.formatErrors(e))
    }
    }

    @Delete('vendors/:id')  
    async adminDeleteVendors(
      @Req() req: Request,
      @Param("id") id:string, 
    ) {
      try {    


      const role = req['user'].role
      const userType = req['user'].sub
      if(role !="admin" || userType != "usave_admin"){
        throw new BadRequestException("unaccessible");
      }

      const where = {
        "vendorID":id
      }

      return await this.vendorService.delete(where);

    } catch (e) {
      console.log("eRROR @controlelr",e)
      throw new BadRequestException(this.errorFormat.formatErrors(e))
    }
    }

    @Get('vendors/:id')  
    async adminGetVendor(
      @Req() req: Request,
      @Param("id") id:string, 
    ) {
      try {    


      const role = req['user'].role
      const userType = req['user'].sub
      if(role !="admin" || userType != "usave_admin"){
        throw new BadRequestException("unaccessible");
      }

      const where = {
        "vendorID":id
      }

      return await this.vendorService.findWhere(where);

    } catch (e) {
      console.log("eRROR @controlelr",e)
      throw new BadRequestException(this.errorFormat.formatErrors(e))
    }
    }

    @Patch('vendors/:id')  
    async scheduleVendorMeeting(
      @Body() dto:any,
      @Param("id") id:string, 
      @Req() req: Request,
    ) {
      try {    


      const role = req['user'].role
      const userType = req['user'].sub
      if(role !="admin" || userType != "usave_admin"){
        throw new BadRequestException("unaccessible");
      }

      const where = {
        "_id":id
      }

      const vendor = await this.vendorService.findWhere(where);

      const emailBody = {
        subject: 'verification-interview',
        to: vendor.email,
        date:`${dto.date} ${dto.startTime}-${dto.endTime}`,
        link:dto.link,
        from:"Verification Team"
      }
      
      // await this      
      // dto.interviewDate = emailBody.date
      dto.isVerified = true
      const res = await this.vendorService.update(id,dto);
      // await this.emailService.scheduleMeeting(emailBody);
      return res

    } catch (e) {
      console.log("eRROR @controlelr",e)
      throw new BadRequestException(this.errorFormat.formatErrors(e))
    }
    }

  // items 
  @Get('items/:vendorID')  
 
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'page for paginating item search',
    type: Number,
    example:1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'limit for item search',
    type: Number,
    example:50,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'status for item search',
    enum: ItemStatus,
    example:ItemStatus.DRAFT,
  })

  async adminListItemsByVendors(
    @Req() req: Request,
    @Param("vendorID") vendorID : string,
    @Query('page') page: number = 1, 
    @Query('status') status: string, 
    @Query('limit') limit: number = 50 
  ) {
    try {    
    const role = req['user'].role
    const userType = req['user'].sub
    if(role !="admin" || userType != "usave_admin"){
      throw new BadRequestException("unaccessible");
    }
    vendorID = vendorID.trim()

    page = Number(page);
    limit = Number(limit);

    if (page < 1) page = 1;  // Page should be at least 1
    if (limit < 1 || limit > 100) limit = 10;  // Limit should be between 1 and 100
    
   
    
    return await this.itemService.adminListItemByVendors(vendorID,page,limit,status);
    
  } catch (e) {
    console.log("eRROR @controlelr",e)
    throw new BadRequestException(this.errorFormat.formatErrors(e))
  }
  }

  // items 
  @Get('new-items')  
  
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'page for paginating item search',
    type: Number,
    example:1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'limit for item search',
    type: Number,
    example:50,
  })
  
  
  async adminListNewItemsByVendors(
    @Req() req: Request,
    @Query("vendorID") vendorID : string,
    @Query('page') page: number = 1, 
    @Query('limit') limit: number = 50 
  ) {
    try {    
    const role = req['user'].role
    const userType = req['user'].sub
    if(role !="admin" || userType != "usave_admin"){
      throw new BadRequestException("unaccessible");
    }

    page = Number(page);
    limit = Number(limit);

    if (page < 1) page = 1;  // Page should be at least 1
    if (limit < 1 || limit > 100) limit = 10;  // Limit should be between 1 and 100

    if(vendorID == "undefined"){
      
      vendorID = null
    }else{
      vendorID = vendorID.trim()
      }

    return await this.itemService.adminListNewItemByVendors(vendorID,page,limit);
    
  } catch (e) {
    console.log("eRROR @adminListNewItemByVendors",e)
    throw new BadRequestException(this.errorFormat.formatErrors(e))
  }
  }


  @Delete('items/:vendorID/') 
  @ApiQuery({
    name: 'itemID',
    required: false,
    description: 'itemID word for item search',
    type: String,
    example:"aed13412313erds",
  })
  
  async adminDeleteItemByVendors(
    @Req() req: Request,
    @Param("vendorID") vendorID : string,
    @Query("itemID") itemID : string,
  ) {
    try {    
    const role = req['user'].role
    const userType = req['user'].sub
    if(role !="admin" || userType != "usave_admin"){
      throw new BadRequestException("unaccessible");
    }
    vendorID = vendorID.trim()
    itemID = itemID.trim()

    return await this.itemService.delete(vendorID,itemID);
    
  } catch (e) {
    console.log("eRROR @controlelr",e)
    throw new BadRequestException(this.errorFormat.formatErrors(e))
  }
  }

  @Patch('items/approve/:itemID/') 
  async adminApproveItem(
    @Req() req: Request,
    @Param("itemID") itemID : string,
  ) {
    try {    
    const role = req['user'].role
    const userType = req['user'].sub
    if(role !="admin" || userType != "usave_admin"){
      throw new BadRequestException("unaccessible");
    }
      itemID = itemID.trim()
      console.log("itemID::: ",itemID)
      return await this.itemService.approveItem(itemID);
    } catch (e) {
      console.log("eRROR @adminApproveItem",e)
      throw new BadRequestException(this.errorFormat.formatErrors(e))
    }
  }
    
    
    // orders
    @Get('orders/')  
    @ApiQuery({
      name: 'startDate',
      required: false,
      description: 'startDate word for order search',
      type: Date,
      example:"02-02-2024",
    })
    @ApiQuery({
      name: 'endDate',
      required: false,
      description: 'endDate word for order search',
      type: Date,
      example:"02-04-2024",
    })
    @ApiQuery({
      name: 'page',
      required: false,
      description: 'page for paginating order search',
      type: Number,
      example:1,
    })
    @ApiQuery({
      name: 'limit',
      required: false,
      description: 'limit for order search',
      type: Number,
      example:50,
    })
    @ApiQuery({
      name: 'status',
      required: false,
      description: 'status for order search',
      enum: OptionType,
      example:OptionType.ACCEPTED,
    })
    @ApiQuery({
      name: 'search',
      required: false,
      description: 'search for order search',
      type: String,
      example:"rice",
    })
    async adminGetOrderByStatusAndRange(
      @Req() req: Request,

      @Query('page') page: number = 1, 
      @Query('limit') limit: number = 50,
      @Query('startDate') startDate: string ,
      @Query('endDate') endDate: string ,
      @Query('status') status: OptionType, 
      @Query('search') search: string ,
    ) {
      try {    
        page = Number(page);
      limit = Number(limit);
  
      if (page < 1) page = 1;  // Page should be at least 1
      if (limit < 1 || limit > 100) limit = 10;  // Limit should be between 1 and 100
  

      const role = req['user'].role
      const userType = req['user'].sub
      if(role !="admin" || userType != "usave_admin"){
        throw new BadRequestException("unaccessible");
      }


      return await this.orderService.getOrderByStatusAndRange(page,limit,status,startDate,endDate,search);

    } catch (e) {
      console.log("eRROR @controlelr",e)
      throw new BadRequestException(this.errorFormat.formatErrors(e))
    }
    }
    
    // getOrderStats totalOrderCost,totalProcessedOrder,totalshipped,totalDelivered
    
    
    // agents
    
    @Get('agents/')  
    @ApiQuery({
      name: 'page',
      required: false,
      description: 'page for paginating agent search',
      type: Number,
      example:1,
    })
    @ApiQuery({
      name: 'limit',
      required: false,
      description: 'limit for agent search',
      type: Number,
      example:50,
    })
    @ApiQuery({
      name: 'search',
      required: false,
      description: 'search for agent search',
      type: String,
      example:"fred",
    })
    async adminGetAgents(
      @Req() req: Request,

      @Query('page') page: number = 1, 
      @Query('limit') limit: number = 50,
      @Query('query') query: string ,
    ) {
      try {    
        page = Number(page);
      limit = Number(limit);
  
      if (page < 1) page = 1;  // Page should be at least 1
      if (limit < 1 || limit > 100) limit = 10;  // Limit should be between 1 and 100
  

      const role = req['user'].role
      const userType = req['user'].sub
      if(role !="admin" || userType != "usave_admin"){
        throw new BadRequestException("unaccessible");
      }


      return await this.agentService.adminFindAll(page,limit,query);

    } catch (e) {
      console.log("eRROR @controlelr",e)
      throw new BadRequestException(this.errorFormat.formatErrors(e))
    }
    }
    
    @Post('agents/')  
    async adminCreateAgents(
      @Req() req: Request,
      @Body() dto:Agent, 
    ) {
      try {    

        dto.password = this.password

      const role = req['user'].role
      const userType = req['user'].sub
      if(role !="admin" || userType != "usave_admin"){
        throw new BadRequestException("unaccessible");
      }


      return await this.agentService.create(dto);

    } catch (e) {
      console.log("eRROR @controlelr",e)
      throw new BadRequestException(this.errorFormat.formatErrors(e))
    }
    }

    @Delete('agents/id')  
    async adminDeleteAgents(
      @Req() req: Request,
      @Param("id") id:string, 
    ) {
      try {    


      const role = req['user'].role
      const userType = req['user'].sub
      if(role !="admin" || userType != "usave_admin"){
        throw new BadRequestException("unaccessible");
      }

      const where = {
        "_id":id
      }

      return await this.agentService.delete(where);

    } catch (e) {
      console.log("eRROR @controlelr",e)
      throw new BadRequestException(this.errorFormat.formatErrors(e))
    }
    }

    // products
    @Get('products/') 
    @ApiQuery({
      name: 'startDate',
      required: false,
      description: 'startDate word for product search',
      type: Date,
      example:"02-02-2024",
    })
    @ApiQuery({
      name: 'endDate',
      required: false,
      description: 'endDate word for product search',
      type: Date,
      example:"02-04-2024",
    })
    @ApiQuery({
      name: 'page',
      required: false,
      description: 'page for paginating product search',
      type: Number,
      example:1,
    })
    @ApiQuery({
      name: 'limit',
      required: false,
      description: 'limit for product search',
      type: Number,
      example:50,
    })
    @ApiQuery({
      name: 'status',
      required: false,
      description: 'status for product search',
      enum: ProductStatus,
      example:ProductStatus.ACTIVE,
    })
    @ApiQuery({
      name: 'search',
      required: false,
      description: 'search for product search',
      type: String,
      example:"rice",
    }) 
    async adminGetProductsByStatusAndRange(
      @Req() req: Request,
      @Query('page') page: number = 1, 
      @Query('limit') limit: number = 50,
      @Query('startDate') startDate: string ,
      @Query('endDate') endDate: string ,
      @Query('status') status: ProductStatus, 
      @Query('search') search: string ,
    ) {
      try {    
        page = Number(page);
      limit = Number(limit);
  
      if (page < 1) page = 1;  // Page should be at least 1
      if (limit < 1 || limit > 100) limit = 10;  // Limit should be between 1 and 100
  

      const role = req['user'].role
      const userType = req['user'].sub
      if(role !="admin" || userType != "usave_admin"){
        throw new BadRequestException("unaccessible");
      }
      return await this.productService.adminGetProductsByStatusAndRange(page,limit,status,startDate,endDate,search);
    } catch (e) {
      console.log("eRROR @controlelr",e)
      throw new BadRequestException(this.errorFormat.formatErrors(e))
    }
  }




  // wallet
  // listVendor earnings

  // admin details
  @Get('/details')
  getAdminDetails(
    @Req() req: Request
  ){
    const role = req['user'].role
    const userType = req['user'].sub
    console.log("userType details:: ",userType)
    if(role !="admin" || userType != "usave_admin"){
      throw new BadRequestException("unaccessible");
    }

    return {firstName:"SuperAdmin",
      lastName:"SuperAdmin",
    }
  }
}
