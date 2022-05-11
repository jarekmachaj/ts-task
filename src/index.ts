import { Basket } from "./Basket";
import { Discount } from "./Discount";
import { BasketItem } from "./BasketItem";
import { ServiceType, ServiceYear } from "./AppData";
import { hasOneOf } from "./Utils";
import * as AppData from './AppData';

export const updateSelectedServices = (
    previouslySelectedServices: ServiceType[],
    action: { type: "Select" | "Deselect"; service: ServiceType }
): ServiceType[] => {
    switch (action.type) {
        case 'Select':
            return selectAction(previouslySelectedServices, action.service)
        case 'Deselect':
            return deselectAction(previouslySelectedServices, action.service)
    }
};

export const calculatePrice = (selectedServices: ServiceType[], selectedYear: ServiceYear): any => {

    let availableBasketItems = AppData.DATA.PRICES[selectedYear] as BasketItem[];
    let availableDiscounts = AppData.DATA.DISCOUNTS[selectedYear] as Discount[];

    let basketItems = availableBasketItems.filter(x => selectedServices.find(y => y === (x.name as ServiceType)));
    let basket = new Basket(basketItems);
    basket.addDiscounts(availableDiscounts);

    return { basePrice: basket.calculatePrice(), finalPrice: basket.calculateDiscountedPrice() }
};


/**
 * Selects action
 * @param previouslySelectedServices previously selected services
 * @param selectedService - new selected service to add
 * @returns new selected services 
 */
function selectAction(previouslySelectedServices: ServiceType[], selectedService: ServiceType): ServiceType[] {
    let selected = new Set<ServiceType>(previouslySelectedServices);

    //no dependencies - add
    if (!(AppData.DATA.DEPENDENT_SERVICES[selectedService])) { 
        selected.add(selectedService); 
        return Array.from(selected);
    }

    //missing dependencies - not adding
    if (hasOneOf<ServiceType>(selected, AppData.DATA.DEPENDENT_SERVICES[selectedService] as ServiceType[]) == false) {
        return Array.from(selected);
    }

    //defult - add
    selected.add(selectedService);
    return Array.from(selected);
}

/**
 * Deselects action
 * @param previouslySelectedServices previously selected services
 * @param deselectedService - selected service to remove
 * @returns new selected services 
 */
function deselectAction(previouslySelectedServices: ServiceType[], deselectedService: ServiceType): ServiceType[] {
    let selected = new Set<ServiceType>(previouslySelectedServices);
    selected.delete(deselectedService);

    ///Remove not needed - depended services
    Object.keys(AppData.DATA.DEPENDENT_SERVICES).forEach(key => {
        if (hasOneOf(selected, AppData.DATA.DEPENDENT_SERVICES[key]) == false) {
            selected.delete(key as ServiceType);
        }
    });

    return Array.from(selected);
}
