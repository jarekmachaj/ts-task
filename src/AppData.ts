export type DiscountType = "Package" | "Discount";
export type ServiceType = "Photography" | "VideoRecording" | "BlurayPackage" | "TwoDayEvent" | "WeddingSession";
export type ServiceYear = 2020 | 2021 | 2022;

export const DATA = {

    DEPENDENT_SERVICES : {
        "BlurayPackage" : ["VideoRecording"],
        "TwoDayEvent" : ["VideoRecording", "Photography"]
    },

    PRICES  : {
        2020 : 
        [
            { name : "Photography", price : 1700},
            { name : "VideoRecording", price : 1700},
            { name : "WeddingSession", price : 600},
            { name : "BlurayPackage", price : 300},
            { name : "TwoDayEvent", price : 400}
        ],
        2021 : 
        [
            { name : "Photography", price : 1800},
            { name : "VideoRecording", price : 1800},
            { name : "WeddingSession", price : 600},
            { name : "BlurayPackage", price : 300},
            { name : "TwoDayEvent", price : 400}
        ],
        2022 : 
        [
            { name : "Photography", price : 1900},
            { name : "VideoRecording", price : 1900},
            { name : "WeddingSession", price : 600},
            { name : "BlurayPackage", price : 300},
            { name : "TwoDayEvent", price : 400}
        ]
    },

    DISCOUNTS : {
        2020:
        [
            {
                discountType: "Package",   
                serviceType: "Photography",
                required: ["VideoRecording"],
                price: 2200,
            },
            {
                discountType: "Discount",   
                serviceType: "WeddingSession",
                required: ["VideoRecording", "Photography"],
                price: 300,
            },
            {
                discountType: "Discount",   
                serviceType: "WeddingSession",
                required: ["Photography"],
                price: 300,
            }
        ],
        2021:
        [
            {
                discountType: "Package",   
                serviceType: "Photography",
                required: ["VideoRecording"],
                price: 2300,
            },
            {
                discountType: "Discount",   
                serviceType: "WeddingSession",
                required: ["VideoRecording", "Photography"],
                price: 300,
            },
            {
                discountType: "Discount",   
                serviceType: "WeddingSession",
                required: ["Photography"],
                price: 300,
            }
        ],
        2022:
        [
            {
                discountType: "Package",   
                serviceType: "Photography",
                required: ["VideoRecording"],
                price: 2500,
            },
            {
                discountType: "Discount",   
                serviceType: "WeddingSession",
                required: ["VideoRecording", "Photography"],
                price: 300,
            },
            {
                discountType: "Discount",   
                serviceType: "WeddingSession",
                required: ["Photography"],
                price: 0,
            }
        ]
    }
}