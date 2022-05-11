import { BasketItem } from "./BasketItem";
import { Discount } from "./Discount";
import { ServiceType } from "./AppData";

/**
 * Basket service
 * Represents basket with selected services (items) 
 */
export class Basket {
    private items: BasketItem[];
    private discountedItems: BasketItem[];
    private discountsToApply: Map<ServiceType, Discount>;

    /**
     * Creates an instance of basket service
     * @param basketItems preloaded items in basket
     */
    constructor(basketItems: BasketItem[]) {
        this.items = [];
        this.discountedItems = [];
        this.discountsToApply = new Map<ServiceType, Discount>();
        //simple js cloning
        basketItems.forEach(val => {
            this.items.push(Object.assign({}, val));
            this.discountedItems.push(Object.assign({}, val));
        });
    }

    /**
     * Calculates base price (without discounts)
     * @returns price : number
     */
    calculatePrice(): number {
        return Basket.calculateItems(this.items);
    }

    /**
     * Calculates price for specified basket items
     * @param basketItems basket items to calculate price
     * @returns sum price for basket items
     */
    private static calculateItems(basketItems: BasketItem[]): number {
        return basketItems.reduce((counter, item) => {
            return counter + item.price;
        }, 0);
    }

    /**
     * Calculates discounted price
     * @returns discounted price 
     */
    calculateDiscountedPrice(): number {
        this.applyDiscounts();
        return this.discountedItems.reduce((counter, item) => {
            return counter + item.price;
        }, 0);
    }

    /**
     * Determines whether discount can be applied
     * Checks if discount meets all requirements for items in basket
     * @param discount 
     * @returns true if discount can be applied 
     */
    private canApplyDiscount(discount: Discount): boolean {
        if (!(this.items.find(x => x.name == discount.serviceType))) return false;

        for (let i of discount.required)
            if (this.items.find(x => x.name == i)) return true;

        return false;
    }

    /**
     * Validates discount and if valid adds discount to basket items
     * If not valid, discount is not added
     * Determines which discount it the best for end user 
     * @param discount 
     */
    private addDiscount(discount: Discount): void {
        if (!this.canApplyDiscount(discount)) return;

        if (!this.discountsToApply.has(discount.serviceType)) {
            this.discountsToApply.set(discount.serviceType, discount);
            return;
        } else {
            let items = this.items;
            let bestDiscount = [this.discountsToApply.get(discount.serviceType), discount].reduce(function (prev, curr) {
                return Basket.calculateSingleDiscount(prev, items) < Basket.calculateSingleDiscount(curr, items) ? prev : curr;
            });
            this.discountsToApply.set(bestDiscount.serviceType, bestDiscount);
        }
    }

    /**
     * Recreates discounted items and applies discounts
     */
    private applyDiscounts(): void {
        //cloning items to discounted items- clears previous discounts
        this.discountedItems = [];
        this.items.forEach(val => {
            this.discountedItems.push(Object.assign({}, val));
        });

        let discountsToApply = Array.from(this.discountsToApply.values());
        discountsToApply.forEach(disc => Basket.applySingleDiscount(disc, this.discountedItems));
    }

    /**
     * Applies discount to selected BasketItem collection
     * @param discount 
     * @param basketItemsRef 
     */
    private static applySingleDiscount(discount: Discount, basketItemsRef: BasketItem[]): void {
        if (discount.discountType == "Package") {
            var mainItem = basketItemsRef.find(x => x.name == discount.serviceType)
            mainItem.price = discount.price;
            for (var val of discount.required) {
                var reqItem = basketItemsRef.find(x => x.name == val);
                reqItem.price = 0;
            }
        } else {
            var mainItem = basketItemsRef.find(x => x.name == discount.serviceType)
            mainItem.price = discount.price;
        }
    }

    /**
     * Calculates discount on BasketItem collection
     * @param discount 
     * @param basketItems 
     * @returns calculated discount
     */
    private static calculateSingleDiscount(discount: Discount, basketItems: BasketItem[]): number {

        //cloning
        const clonedItems: BasketItem[] = [];
        basketItems.forEach(val => clonedItems.push(Object.assign({}, val)));

        this.applySingleDiscount(discount, clonedItems);
        return Basket.calculateItems(clonedItems);
    }

    /**
     * Adds discount to 
     * @param availableDiscounts 
     */
    addDiscounts(availableDiscounts: Discount[]): void {
        availableDiscounts.forEach(x => this.addDiscount(x));
    }
}