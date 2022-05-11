import { ServiceType } from "./AppData";
import { DiscountType } from "./AppData";

/**
 * Discount
 */
export interface Discount {
    discountType: DiscountType;
    serviceType: ServiceType;
    required: ServiceType[];
    price: number;
}
