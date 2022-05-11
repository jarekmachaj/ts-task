import { Basket } from "./Basket";

describe("basket.calculateprice", () => {

    let basket: Basket;

    beforeEach(() => {
        basket = new Basket(
            [
                { name : "VideoRecording", price : 3000},
                { name : "Photography", price : 30},
                { name : "BlurayPackage", price : 20},
            ]
        );
    });

    afterEach(() => {
        basket = null;
    });
    
    test("should sum properly item prices in basket", () => {
        const result = basket.calculatePrice();
        expect(result).toEqual(3000 + 30 + 20);
    });

    test("should sum properly item prices in basket", () => {
        const result = basket.calculatePrice();
        expect(result).toEqual(3000 + 30 + 20);
    });

    test("should sum properly items prices in basket after discount", () => {
        basket.addDiscounts([{
            discountType: "Package",   
            serviceType: "Photography",
            required: ["VideoRecording"],
            price: 10,
        }])
        const result = basket.calculatePrice();
        expect(result).toEqual(3000 + 30 + 20);
    });
});

describe("basket.calculatediscount", () => {

    let basket: Basket;

    beforeEach(() => {
        basket = new Basket(
            [
                { name : "VideoRecording", price : 3000},
                { name : "Photography", price : 30},
                { name : "BlurayPackage", price : 20},
            ]
        );
    });

    afterEach(() => {
        basket = null;
    });

    test("should sum properly discounted item prices in basket after discount", () => {
        basket.addDiscounts([{
            discountType: "Package",   
            serviceType: "Photography",
            required: ["VideoRecording"],
            price: 2200,
        }])
        const result = basket.calculateDiscountedPrice();
        expect(result).toEqual(2200 + 0 + 20);
    });

   

    test("should not add invalid discounts", () => {
        basket.addDiscounts([{
            discountType: "Package",   
            serviceType: "VideoRecording",
            required: ["TwoDayEvent"],
            price: 1200,
        }])
        const result = basket.calculateDiscountedPrice();
        expect(result).toEqual(3000 + 30 + 20);
    });

  

    test("should add valid discounts types", () => {
        basket.addDiscounts([{
            discountType: "Discount",   
            serviceType: "VideoRecording",
            required: ["BlurayPackage"],
            price: 1200,
        }])
        const result = basket.calculateDiscountedPrice();
        expect(result).toEqual(1200 + 30 + 20);
    });
});