// src/db/for-feature.db.ts
import { User, UserSchema } from "../module/user/entities/user.entity"
import { Vendor, VendorSchema } from "../module/vendor/entities/vendor.entity"
import { Admin, AdminSchema } from "../module/admin/entities/admin.entity"
import { Product,ProductSchema } from "src/module/product/entities/product.entity";
import { Cart,CartSchema } from "src/module/cart/entities/cart.entity";
import { Logistic,LogisticSchema } from "src/module/logistics/entities/logistic.entity";
import { Order ,OrderSchema} from "src/module/order/entities/order.entity";
import { SavedItem,SavedItemSchema } from "src/module/saved-items/entities/saved-item.entity";

export default [
  { name: User.name, schema: UserSchema },
  { name: Vendor.name, schema: VendorSchema },
  { name: Admin.name, schema: AdminSchema },
  { name: Product.name, schema: ProductSchema },
  { name: Cart.name, schema: CartSchema },
  { name: Logistic.name, schema: LogisticSchema },
  { name: Order.name, schema: OrderSchema },
  { name: SavedItem.name, schema: SavedItemSchema },
];