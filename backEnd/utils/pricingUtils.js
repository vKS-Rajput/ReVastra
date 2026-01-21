/**
 * Pricing utility functions for rental pricing (Backend)
 * 
 * Pricing Structure (cumulative - each day ADDS percentage of BASE to total):
 * - Day 1: Base price
 * - Days 2-3: Each day adds 30% of base to total
 * - Days 4-7: Each day adds 50% of base to total
 * - Day 8+: Each day adds 72% of base to total
 * 
 * Security Deposit: 40% of product's original price (refundable)
 */

// Pricing constants
export const URGENT_FEE = 50;
export const URGENT_THRESHOLD_DAYS = 2;
export const SECURITY_DEPOSIT_PERCENTAGE = 0.40;

export const calculateTieredPrice = (basePrice, rentalDays) => {
    if (rentalDays <= 0 || basePrice <= 0) {
        return { total: 0, breakdown: [] };
    }

    let total = 0;
    const breakdown = [];

    for (let day = 1; day <= rentalDays; day++) {
        let addedAmount;
        let increasePercent = null;

        if (day === 1) {
            addedAmount = basePrice;
        } else if (day <= 3) {
            increasePercent = 30;
            addedAmount = basePrice * 0.30;
        } else if (day <= 7) {
            increasePercent = 50;
            addedAmount = basePrice * 0.50;
        } else {
            increasePercent = 72;
            addedAmount = basePrice * 0.72;
        }

        total += addedAmount;

        breakdown.push({
            day,
            addedAmount: Math.round(addedAmount * 10) / 10,
            runningTotal: Math.round(total * 10) / 10,
            increasePercent,
            tier: day === 1 ? 'base' : (day <= 3 ? 'tier1' : (day <= 7 ? 'tier2' : 'tier3'))
        });
    }

    total = Math.round(total * 10) / 10;
    return { total, breakdown, rentalDays };
};

export const calculateSecurityDeposit = (productPrice) => {
    if (!productPrice || productPrice <= 0) return 0;
    return Math.round(productPrice * SECURITY_DEPOSIT_PERCENTAGE);
};

export const isUrgentDelivery = (orderDate, deliveryDate) => {
    if (!orderDate || !deliveryDate) return false;
    const orderTime = new Date(orderDate).getTime();
    const deliveryTime = new Date(deliveryDate).getTime();
    const diffDays = (deliveryTime - orderTime) / (1000 * 60 * 60 * 24);
    return diffDays < URGENT_THRESHOLD_DAYS;
};

export const calculateRentalDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(diffDays, 0);
};
