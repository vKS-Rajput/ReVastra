/**
 * Pricing utility functions for DAILY COMPOUNDING rental pricing (Backend)
 * 
 * Pricing Structure (each day increases from previous day):
 * - Day 1: Base rental price
 * - Day 2: Day 1 price + 10%
 * - Day 3: Day 2 price + 10%
 * - Day 4: Day 3 price + 20%
 * - Day 5: Day 4 price + 20%
 * - Day 6+: Previous day + 30%
 * 
 * Security Deposit: 40% of product's original price (refundable)
 */

// Pricing constants
export const URGENT_FEE = 50; // ₹50 for urgent delivery
export const URGENT_THRESHOLD_DAYS = 2; // Orders with delivery < 2 days are urgent
export const SECURITY_DEPOSIT_PERCENTAGE = 0.40; // 40% of product price

/**
 * Calculate daily compounding rental price
 * Each day's price increases from the previous day
 * 
 * @param {number} basePrice - Daily rental price for Day 1
 * @param {number} rentalDays - Total rental days
 * @returns {object} - Breakdown of pricing per day
 */
export const calculateTieredPrice = (basePrice, rentalDays) => {
    if (rentalDays <= 0 || basePrice <= 0) {
        return { total: 0, breakdown: [] };
    }

    let total = 0;
    const breakdown = [];
    let currentDayPrice = basePrice;

    for (let day = 1; day <= rentalDays; day++) {
        let increasePercent = 0;

        if (day === 1) {
            // Day 1: Base price, no increase
            currentDayPrice = basePrice;
        } else if (day <= 3) {
            // Days 2-3: +10% from previous day
            increasePercent = 10;
            currentDayPrice = Math.round(currentDayPrice * 1.10);
        } else if (day <= 5) {
            // Days 4-5: +20% from previous day
            increasePercent = 20;
            currentDayPrice = Math.round(currentDayPrice * 1.20);
        } else {
            // Days 6+: +30% from previous day
            increasePercent = 30;
            currentDayPrice = Math.round(currentDayPrice * 1.30);
        }

        total += currentDayPrice;

        breakdown.push({
            day,
            rate: currentDayPrice,
            increasePercent: day === 1 ? null : increasePercent,
            tier: day <= 3 ? 'base' : (day <= 5 ? 'extended' : 'long')
        });
    }

    return { total, breakdown, rentalDays };
};

/**
 * Calculate security deposit (40% of original product price)
 * 
 * @param {number} productPrice - Original price of the product
 * @returns {number} - Security deposit amount
 */
export const calculateSecurityDeposit = (productPrice) => {
    if (!productPrice || productPrice <= 0) return 0;
    return Math.round(productPrice * SECURITY_DEPOSIT_PERCENTAGE);
};

/**
 * Check if delivery is urgent based on date difference
 * 
 * @param {Date} orderDate - When order is placed
 * @param {Date} deliveryDate - When delivery is requested
 * @returns {boolean} - True if urgent
 */
export const isUrgentDelivery = (orderDate, deliveryDate) => {
    if (!orderDate || !deliveryDate) return false;

    const orderTime = new Date(orderDate).getTime();
    const deliveryTime = new Date(deliveryDate).getTime();
    const diffDays = (deliveryTime - orderTime) / (1000 * 60 * 60 * 24);

    return diffDays < URGENT_THRESHOLD_DAYS;
};

/**
 * Calculate days between two dates
 * 
 * @param {Date} startDate 
 * @param {Date} endDate 
 * @returns {number} - Number of days
 */
export const calculateRentalDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(diffDays, 0);
};
