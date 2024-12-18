// src/db/for-feature.db.ts
import { User, UserSchema } from "../module/user/entities/user.entity"
import { Vendor, VendorSchema } from "../module/vendor/entities/vendor.entity"
import { Admin, AdminSchema } from "../module/admin/entities/admin.entity"
import { Product,ProductSchema } from "src/module/product/entities/product.entity";
import { Cart,CartSchema } from "src/module/cart/entities/cart.entity";
import { Logistic,LogisticSchema } from "src/module/logistics/entities/logistic.entity";
import { Order ,OrderSchema} from "src/module/order/entities/order.entity";
import { SavedItem,SavedItemSchema } from "src/module/saved-items/entities/saved-item.entity";
import { WaveUser,WaveUserSchema } from "src/module/u-wave-user/entities/u-wave-user.entity";
import { Freight, FreightSchema } from "src/module/freight/entities/freight.entity";
import { ItemSchema,Item } from "src/module/items/entities/item.entity";
import { ProductCategory,ProductCategorySchema } from "src/module/product-category/entities/product-category.entity";
import { ProductSubCategory ,ProductSubCategorySchema} from "src/module/product-sub-category/entities/product-sub-category.entity";
import { Agent, AgentSchema } from "src/module/agent/entities/agent.entity";
import { Wallet,WalletSchema } from "src/module/wallet/entities/wallet.entity";
import { Shipment,ShipmentSchema } from "src/module/shipment/entities/shipment.entity";
import { FreightReceiptSchema ,FreightReceipt} from "src/module/freight_receipt/entities/freight_receipt.entity";
import { Donation, DonationSchema ,DonationSchema} from "src/module/donation/entities/donation.entity";


export default [
  { name: User.name, schema: UserSchema },
  { name: Vendor.name, schema: VendorSchema },
  { name: Admin.name, schema: AdminSchema },
  { name: Product.name, schema: ProductSchema },
  { name: Cart.name, schema: CartSchema },
  { name: Logistic.name, schema: LogisticSchema },
  { name: Order.name, schema: OrderSchema },
  { name: SavedItem.name, schema: SavedItemSchema },
  { name: WaveUser.name, schema: WaveUserSchema },
  { name: Freight.name, schema: FreightSchema },
  { name: Item.name, schema: ItemSchema },
  { name: ProductCategory.name, schema: ProductCategorySchema },
  { name: ProductSubCategory.name, schema: ProductSubCategorySchema },
  { name: Agent.name, schema: AgentSchema },
  { name: Wallet.name, schema: WalletSchema },
  { name: FreightReceipt.name, schema: FreightReceiptSchema },
  { name: Shipment.name, schema: ShipmentSchema },
  { name: Donation.name, schema: DonationSchema },
];