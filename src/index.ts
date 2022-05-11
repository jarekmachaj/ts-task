export type ServiceYear = 2020 | 2021 | 2022;
export type ServiceType = "Photography" | "VideoRecording" | "BlurayPackage" | "TwoDayEvent" | "WeddingSession";

const DependentServices = {
    "BlurayPackage" : ["VideoRecording"],
    "TwoDayEvent" : ["VideoRecording", "Photography"]
}

const Prices  = {
    2020 : 
        { "Photography" : 1700, "VideoRecording" : 1700, "WeddingSession" : 600, "BlurayPackage" : 300, "TwoDayEvent" : 400 },
    2021 : 
        { "Photography" : 1800, "VideoRecording" : 1800, "WeddingSession" : 600, "BlurayPackage" : 300, "TwoDayEvent" : 400 },
    2022 : 
        { "Photography" : 1900, "VideoRecording" : 1900, "WeddingSession" : 600, "BlurayPackage" : 300, "TwoDayEvent" : 400 }
}

const Discounts  = {
    "Photography" : [{
            Required : ["VideoRecording"],
            Type: "Package",
            Prices: {
                2020 : 2200,
                2021 : 2300,
                2022 : 2500
        }}]
    ,
    "WeddingSession" : [{
            Required : ["VideoRecording", "Photography"],
            Type: "Discount",
            Prices: {
                2020 : 300,
                2021 : 300,
                2022 : 300
        }},
        {
            Required : ["Photography"],
            Type: "Discount",
            Prices: {
                2020 : 300,
                2021 : 300,
                2022 : 0
            }}]
}

export const updateSelectedServices = (
    previouslySelectedServices: ServiceType[],
    action: { type: "Select" | "Deselect"; service: ServiceType }
) => {
    switch (action.type) {
        case 'Select':
            return selectAction(previouslySelectedServices, action.service)
        case 'Deselect':
            return deselectAction(previouslySelectedServices, action.service)
        default:
            throw new Error();
    }
};

export const calculatePrice = (selectedServices: ServiceType[], selectedYear: ServiceYear) => {

    let basePriceObj = {};
    let finalPriceObj = {};
    Object.assign(basePriceObj, Prices[selectedYear]);
   
    Object.keys(basePriceObj).forEach(key => {
        if (!selectedServices.find(x => x == (key as ServiceType))) delete basePriceObj[key];
    });

    Object.assign(finalPriceObj, basePriceObj);
    let basePrice = calculateBasket(basePriceObj);

    Object.keys(finalPriceObj).forEach(key => {
        var discount = findBestDiscount(key, finalPriceObj, selectedYear);
        if (discount != undefined) applySingleDiscount(finalPriceObj, discount, key, selectedYear);
    });

    let finalPrice = calculateBasket(finalPriceObj);

    return { basePrice , finalPrice }
};

let selectAction = (previouslySelectedServices: ServiceType[], selectedService: ServiceType) : ServiceType[] => {
    let selected = new Set(previouslySelectedServices);
    //TODO
    if (selectedService === "BlurayPackage" && selected.has("VideoRecording") == false)
        return Array.from(selected);
    if (selectedService === "TwoDayEvent" && selected.has("VideoRecording") == false && selected.has("Photography") == false)
        return Array.from(selected);

    selected.add(selectedService);

    return Array.from(selected);
}

let deselectAction = (previouslySelectedServices: ServiceType[], deselectedService: ServiceType) : ServiceType[] => {
    let selected = new Set(previouslySelectedServices);
    selected.delete(deselectedService);

    ///Remove not needed
    Object.keys(DependentServices).forEach( key => {
        if(hasOneOf(selected, DependentServices[key]) == false) {
            selected.delete(key as ServiceType);
        }
    });

    return Array.from(selected);
}

let calculateBasket = (basePriceObj: any) : number => {
    let price = 0;
    Object.keys(basePriceObj).forEach(key => {
        price += basePriceObj[key];
    });
    return price;
}

let calculateSingleDiscount = (pricingObj : any, discountName: string, discount: any, year: number) : number => {
    var calculateObj = {};
    Object.assign(calculateObj, pricingObj);

    if (discount.Type == "Package"){

        calculateObj[discountName] = discount.Prices[year];
        for (var val of discount.Required) {
            calculateObj[val] = 0;
        }
    } else {
        calculateObj[discountName] = discount.Prices[year];
    }

    return calculateBasket(calculateObj);
}

let validateDiscount = (primaryServiceName: string, discount: any, pricingObj: any ) : boolean => {

    if (!(primaryServiceName in pricingObj)) return false;

    for (let i of discount.Required)
        if (i in pricingObj) return true;

    return false;
}

let findBestDiscount = (primaryServiceName: string, pricingObj: any, year : number) : any => {

    let selectedDiscounts = Discounts[primaryServiceName];
    if (selectedDiscounts == undefined) return undefined;
    let minDiscount = undefined;
    let discountResult = undefined;
    for (let discount of selectedDiscounts){
        if (!validateDiscount(primaryServiceName, discount, pricingObj)) continue;
        var afterDisc = calculateSingleDiscount(pricingObj, primaryServiceName, discount, year);
        if (minDiscount == undefined || afterDisc < minDiscount) {
            minDiscount = afterDisc;
            discountResult = discount;
        }
    } 
    return discountResult;
}

let applySingleDiscount = (basketObj : any, discountObj: any, discountName: string, year: number) => {
   
    if (discountObj.Type == "Package"){

        basketObj[discountName] = discountObj.Prices[year];
        for (var val of discountObj.Required) {
            basketObj[val] = 0;
        }
    } else {
        basketObj[discountName] = discountObj.Prices[year];
    }
}

let hasOneOf = (items : Set<string>, arrToCheck: string[]) : boolean => {
    var result = false;

    arrToCheck.forEach(element => {
        if (items.has(element)) result = true;
    });
    
    return result;
}
