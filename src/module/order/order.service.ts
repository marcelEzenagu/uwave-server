import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OptionType, Order, OrderDocument, PaymentStatusType } from './entities/order.entity';
import { Model,Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CartService } from '../cart/cart.service';
import { ItemsService } from '../items/items.service';
import { StripePayment } from 'src/helpers/stripePayment';
import { Frequency, UtilityService } from 'src/helpers/utils';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly stripeService: StripePayment,
    private  utilityService: UtilityService,

    private  cart: CartService,
    private  item: ItemsService
  ) {}

  async create(createOrderDto: CreateOrderDto) {
   
    // weightSrvRecords
    // this.findWhere()
    const newUserOrder = new this.orderModel(createOrderDto);
    return await newUserOrder.save();
  }

  async findAll(page: number, limit: number,where :{}) {
    const skip = (page - 1) * limit;

   const data = await this.orderModel.find()
      .where(where)
      .skip(skip)
      .limit(limit)
      .exec();

      const total = await this.orderModel.countDocuments();
      return {
        data,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      };
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  async findWhere(where: {}): Promise<Order> {
    return await this.orderModel.findOne().where(where).exec();
  }

  async isOrderForUser(orderID,userID: string) {
   
    // const where = {userID,"_id":objectId}
    const where = {userID,"_id":orderID}

    const result = await this.orderModel.findOne(where).exec();
    
    // process.exit()
    if(result != undefined){
      
      return {success:true,result}
    }
    return {success:false}
  }

  async findUserOrders(where: {}) {
    return await this.orderModel.find().where(where).exec();
  }

  async updatePayment(paymentIntentID, userID: string, updateOrderDto: UpdateOrderDto) {
      const where = { userID, paymentIntentID };
      await  Promise.all([
       await this.stripeService.confirmPaymentIntent(paymentIntentID),
        

        await this.item.decreaseItem(updateOrderDto.items),
        await this.cart.removeCart(updateOrderDto.cartID,userID),
      ])
      console.log("updateOrderDto::: ",updateOrderDto)

      return await this.orderModel.findOneAndUpdate(where, updateOrderDto,{new:true})
    }
  
  async update(orderID, userID: string, updateOrderDto: UpdateOrderDto) {
    const where = { userID, _id: orderID };
    return await this.orderModel.findOneAndUpdate(where, updateOrderDto, {
      new: true,
    });
  }
  
  async updateStatus(orderID, userID: string, updateOrderDto: UpdateOrderDto) {
    const where = { userID, _id: orderID };

    const updatedStatus = {"status":updateOrderDto.status}
    return await this.orderModel.findOneAndUpdate(where, updateOrderDto, {
      new: true,
    });
  }

  

  async getVendorSales(vendorID: string,daysAgo?:number,status?:OptionType) {
    const calculatedDaysAgo = new Date();
    calculatedDaysAgo.setDate(calculatedDaysAgo.getDate() - daysAgo);
  
    return await this.orderModel.aggregate([
      // Match orders that contain items for the given vendor and are within the last 7 days
      { 
        $match: { 
          'items.vendorID': vendorID,
          createdAt: { $gte: calculatedDaysAgo },
          status : status
        } 
      },
      
      // Unwind the items array to work with each item individually
      { $unwind: '$items' },
      
      // Group by vendorID and sum the total sales (quantity * price)
      { 
        $group: {
          _id: '$items.vendorID',
          totalSales: { 
            $sum: { $multiply: ['$items.quantity', '$items.price'] } 
          },
          orderCount: { $sum: 1 } // Count the number of orders
        }
      }
    ]);
  }
  
  async getAllVendorSales(vendorID: string) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
    return await this.orderModel.aggregate([
      // Match orders that contain items for the given vendor and are within the last 7 days
      { 
        $match: { 
          'items.vendorID': vendorID,
          createdAt: { $gte: sevenDaysAgo }  // Only include orders from the last 7 days
        } 
      },
      
      // Unwind the items array to work with each item individually
      { $unwind: '$items' },
      
      // { $match: { 'items.vendorID': vendorID } },
      
      // Group by vendorID, sum total sales, and collect the ordered items
      { 
        $group: {
          _id: '$items.vendorID',
          totalSales: { 
            $sum: { $multiply: ['$items.quantity', '$items.price'] } 
          },
          orderCount: { $sum: 1 }, // Count the number of orders
          items: { $push: '$items' } // Collect all items belonging to the vendor
        }
      }
    ]);
  }
  
  async getNewCustomers(vendorID:string,daysAgo:Frequency, start?, end? :string) {
    let {startDate,endDate} = this.utilityService.calculatePreviousDate(daysAgo)
    let starting = new Date(startDate),
    ending= new Date(endDate) 
console.log("starting:: ",starting,"ending:: ",ending)


    const newCustomers = await this.orderModel.aggregate([
      {
        // Step 1: Match orders from the specific vendor within the date range
        $match: {
          'items.vendorID': vendorID,
          // createdAt: { $gte: starting,
          //              $lte: endDate
          //             }       
         }
      },
      {
        // Step 2: Group by customerID, and calculate the firstOrderDate
        $group: {
          _id: '$userID',  // Group orders by customerID
          firstOrderDate: { $min: '$createdAt' },  // Get the earliest order date per customer
          totalNewCustomers: { $sum: 1 }, // Count total items

        }
      },
      {
        // Step 3: Filter customers whose first order falls within the date range
        $match: {
          firstOrderDate: { $gte: starting, $lte: ending }
        }
      },
      {
        $project: {
          _id: 0, // Exclude _id
          totalNewCustomers: 1, // Keep totalItems
        },
      },
    ]);

    console.log("newCustomers::: ",newCustomers)
    if (newCustomers.length > 0) {
      return newCustomers[0];
    } else {
      return { totalNewCustomers: 0 };
    }
}
  
// vendor dashBoard
  async countVendorNewCustomers(vendorID:string, daysAgo :Frequency ) {
    

    const {startDate,endDate} = this.utilityService.calculatePreviousDate(daysAgo)
    const newCustomers = await this.orderModel.aggregate([
      {
        // Step 1: Match orders from the specific vendor within the date range
        $match: {
          "products.vendorID": vendorID,
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        // Step 2: Group by customerID, and calculate the firstOrderDate
        $group: {
          _id: '$userID',  // Group orders by customerID
          firstOrderDate: { $min: '$createdAt' }  // Get the earliest order date per customer
        }
      },
      {
        // Step 3: Filter customers whose first order falls within the date range
        $match: {
          firstOrderDate: { $gte: startDate, $lte: endDate }
        }
      },
      // Optionally: Lookup or project customer details
    ]);
return newCustomers
}

async countOrdersByVendorID(vendorID: string, daysAgo:Frequency,start?, end? :string): Promise<{}> {
  try{

const {startDate,endDate} = this.utilityService.calculatePreviousDate(daysAgo)

  const totalOrders =  await this.orderModel.aggregate([
    {
      $match: {
        'items.vendorID': vendorID,
        createdAt: { $gte: new Date(startDate),
          $lte: new Date(endDate) 
        }
      }
    },
    { $group: {
      _id: '$items.vendorID',  // Group orders by customerID
      totalOrders: { $sum: 1 }, // Count total items

    }},
    {
      $project: {
        _id: 0, // Exclude _id
        totalOrders: 1, // Keep totalItems
      },
    },
  
  ]).exec();

  if (totalOrders.length > 0) {
    return totalOrders[0];
  } else {
    return { totalOrders: 0 };
  }
}catch(e){
  console.log("error== ",e)}
}
// end vendor dashBoard

async findOrdersByVendorID(vendorID: string, daysAgo,page,limit:number): Promise<{}> {
  try{

const skip = (page - 1) * limit;

  
  const estimatedDaysAgo = new Date();
  if(!daysAgo){
    daysAgo= 7
  }
  estimatedDaysAgo.setDate(estimatedDaysAgo.getDate() - (daysAgo));
  
  console.log(" estimatedDaysAgo:: ",estimatedDaysAgo)
  // const orders = await this.orderModel.aggregate([
   
  //   {
  //     $match: {
  //       'items.vendorID': vendorID  // Filter items based on the specified vendorID
  //     }
  //   },
  //   {
  //     $lookup: {
  //       from: 'users',             // Reference to the User collection
  //       localField: 'userID',      // Field in Order schema referencing User
  //       foreignField: 'userID',    // Field in User schema to join with (UUID string userID)
  //       as: 'userDetails'          // Field to hold the joined user details
  //     }
  //   },
  //   {
  //     $unwind: { 
  //       path: '$userDetails', 
  //       preserveNullAndEmptyArrays: true  // Keeps the document even if no user details found
  //     }
  //   },
  //   {
  //     $project: {
  //       _id: 1,                     // Include Order ID
  //       paymentStatus: 1,                  // Include cartID
  //       items: 1,                   // Include matched items
  //       totalCost: 1,               // Include totalCost
  //       status: 1,                  // Include order status
  //       orderCreatedAt: '$createdAt', // Include createdAt field for order
  //       shippingAddress : 1,
  //       'userDetails.firstName':1,
  //       'userDetails.lastName':1
  //     }
  //   },
  //   { 
  //     $skip: skip // Skip the number of documents based on the current page
  //   },
  //   { 
  //     $limit: limit // Limit the number of documents to 'limit' per page
  //   }
  // ]).exec();
  return  await this.orderModel.aggregate([
    {
      $match: {
        'items.vendorID': vendorID
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userID',
        foreignField: 'userID',
        as: 'userDetails'
      }
    },
    {
      $unwind: {
        path: '$userDetails',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $facet: {
        paginatedResults: [
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              _id: 1,
              paymentStatus: 1,
              items: 1,
              totalCost: 1,
              status: 1,
              orderCreatedAt: '$createdAt',
              shippingAddress: 1,
              'userDetails.firstName': 1,
              'userDetails.lastName': 1
            }
          }
        ],
        statusCounts: [
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 }
            }
          }
        ]
      }
    }
  ]).exec();
  
  
  // const totalOrders = await this.orderModel.aggregate([
  //   { $match: { 'items.vendorID': vendorID } },
  //   { $count: "totalCount" }
  // ]).exec();
  // const totalProcessing = await this.orderModel.aggregate([
  //   { $match: { 'items.vendorID': vendorID } },
  //   { $count: "totalCount" }
  // ]).exec();
  // const totalShipped = await this.orderModel.aggregate([
  //   { $match: { 'items.vendorID': vendorID } },
  //   { $count: "totalCount" }
  // ]).exec();

  // const totalCount = totalOrders[0]?.totalCount || 0;
  // return { 
    
  //    totalPages : Math.ceil(totalCount / limit),
  //    total:totalCount,
  //    data:orders,
  //    currentPage: page,

  // }

}catch(e){console.log("error== ",e)}
}

async findOrdersByStatus(vendorID: string, daysAgo:number): Promise<Order[]> {
  const estimatedDaysAgo = new Date();
  if(!daysAgo){
    daysAgo= 7
  }
  estimatedDaysAgo.setDate(estimatedDaysAgo.getDate() - (daysAgo));
  
  console.log(" estimatedDaysAgo:: ",estimatedDaysAgo)
  return this.orderModel.aggregate([
    {
      $unwind: '$items', // Unwind the items array
    },
    {
      $match: {
        'items.vendorID': vendorID, // Match the specified vendorID in items
        // createdAt: { $gte: estimatedDaysAgo } // Uncomment to filter by date if needed
      },
    },
    {
      $lookup: {
        from: 'users', // Collection name for users
        localField: 'userID', // Field in orders that references the user
        foreignField: '_id', // Field in users that is matched to userID in orders
        as: 'userDetails' // Output field for user details
      }
    },
    {
      $unwind: {
        path: '$userDetails',
        preserveNullAndEmptyArrays: true // Keep orders without a matching user
      }
    },
    {
      $project: {
        _id: 1, // Include orderID (_id field in MongoDB)
        items: 1, // Include the matched item
        orderCreatedAt: '$createdAt', // Include createdAt field (renamed to orderCreatedAt)
        status: 1, // Include status
        userDetails: {
          _id: 1, // Include userID
          name: 1, // Include name from the user details if available
          email: 1 // Include email from the user details if available
        }
      }
    }
  ]).exec();
  
  
}

async findOpenOrdersForVendors(daysAgo:number): Promise<Order[]> {
  if(!daysAgo){
    daysAgo= 7
  }
  const estimatedDaysAgo = new Date();
  const estimatedDaysAgo1 = new Date();
  estimatedDaysAgo.setDate(estimatedDaysAgo.getDate() - (daysAgo));
  console.log(" estimatedDaysAgo1:: ",estimatedDaysAgo1,":: ")
  
  console.log(" estimatedDaysAgo:: ",estimatedDaysAgo,":: ",estimatedDaysAgo1 > estimatedDaysAgo,
    OptionType.ACCEPTED,
    PaymentStatusType.SUCCESS,)

  return this.orderModel.aggregate([
    {
      $unwind: '$items',  // Unwind the products array
    },
    {
      $match: {
        // status:OptionType.ACCEPTED,
        // paymentStatus:PaymentStatusType.SUCCESS,
        createdAt: { $gte: estimatedDaysAgo },  // Only include orders from the last 7 days
      },
    },
    {
      $project: {
        _id: 1,  // Include orderID (MongoDB _id)
        products: 1,  // Include the matched product
        orderCreatedAt: '$createdAt',  // Include createdAt field (renamed to orderCreatedAt)
        status: 1,  // Include status
      },
    }
  ]).exec(); 
}

async getOrderByStatusAndRange(page,limit :number, status:OptionType,start,end,search:string) {
  
  const skip = (page - 1) * limit;

  
  const startDate = new Date(start);  // Start of the range
  const endDate = new Date(end);      // End of the range

  const filter: any = { }
  
  if(status){

    filter.status = status
  }
    
  if (search  && search.trim()) {
    const regex = new RegExp(search, 'i'); // 'i' for case-insensitive matching
    filter.$or = [
      { 'items.name': { $regex: regex } },    // Match `product.name` with regex
      { orderID: { $regex: regex } },                 // Match `orderID` with regex
    ];

  }
  if (start || end) {

    filter.createdAt = {};
    if (startDate) {
      filter.createdAt.$gte = startDate;  // Filter by start date
    }
    if (endDate) {
      filter.createdAt.$lte = endDate;    // Filter by end date
    } 

  }

  const data = await this.orderModel.find(filter)
                                      .skip(skip)
                                      .limit(limit)
                                      .exec();

  const total = await this.orderModel.countDocuments();

  return {
    data,total,
    currentPage: page,
    totalPages: Math.ceil(total / limit)

  }
}

  async remove(where): Promise<any> {
    await this.orderModel.findOneAndDelete(where);
    return `This action removes a #${where?._id} order`;
  }
}
