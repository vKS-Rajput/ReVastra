/**
 * Pricing utility functions for rental pricing (Frontend)
 * 
 * Pricing Structure (percentage of BASE price added each day):
 * - Day 1: Base rental price
 * - Days 2-3: Base + 30% of base
 * - Days 4-7: Base + 50% of base
 * - Day 8+: Base + 72% of base
 * 
 * Security Deposit: 40% of product's original price (refundable)
 */

// Pricing constants
export const URGENT_FEE = 50; // ₹50 for urgent delivery
export const URGENT_THRESHOLD_DAYS = 2; // Orders with delivery < 2 days are urgent
export const SECURITY_DEPOSIT_PERCENTAGE = 0.40; // 40% of product price

/**
 * Calculate rental price with day-based percentage increases
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

    for (let day = 1; day <= rentalDays; day++) {
        let dayPrice;
        let increasePercent = null;

        if (day === 1) {
            // Day 1: Base price only
            dayPrice = basePrice;
        } else if (day <= 3) {
            // Days 2-3: Base + 30% of base
            increasePercent = 30;
            dayPrice = basePrice + (basePrice * 0.30);
        } else if (day <= 7) {
            // Days 4-7: Base + 50% of base
            increasePercent = 50;
            dayPrice = basePrice + (basePrice * 0.50);
        } else {
            // Day 8+: Base + 72% of base
            increasePercent = 72;
            dayPrice = basePrice + (basePrice * 0.72);
        }

        // Round to 2 decimal places
        dayPrice = Math.round(dayPrice * 100) / 100;
        total += dayPrice;

        breakdown.push({
            day,
            rate: dayPrice,
            increasePercent,
            tier: day === 1 ? 'base' : (day <= 3 ? 'tier1' : (day <= 7 ? 'tier2' : 'tier3'))
        });
    }

    // Round total to nearest integer
    total = Math.round(total);

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

/**
 * Get minimum rental start date (tomorrow)
 */
export const getMinStartDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
};

/**
 * Get minimum rental end date based on start date
 */
export const getMinEndDate = (startDate) => {
    if (!startDate) return getMinStartDate();
    const minEnd = new Date(startDate);
    minEnd.setDate(minEnd.getDate() + 1);
    return minEnd;
};
