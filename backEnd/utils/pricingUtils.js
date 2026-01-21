/**
 * Pricing utility functions for tiered rental pricing (Backend)
 * 
 * Pricing Structure:
 * - Days 1-3: Base rental price (same for all 3 days)
 * - Days 4+: +15% over base (average of 10-20%)
 * 
 * Security Deposit: 40% of product's original price (refundable)
 */

// Pricing constants
export const URGENT_FEE = 50; // ₹50 for urgent delivery
export const URGENT_THRESHOLD_DAYS = 2; // Orders with delivery < 2 days are urgent
export const SECURITY_DEPOSIT_PERCENTAGE = 0.40; // 40% of product price

/**
 * Calculate tiered rental price
 * Days 1-3: Base price (same rate)
 * Days 4+: +15% over base
 * 
 * @param {number} basePrice - Daily rental price
 * @param {number} rentalDays - Total rental days
 * @returns {object} - Breakdown of pricing
 */
export const calculateTieredPrice = (basePrice, rentalDays) => {
    if (rentalDays <= 0 || basePrice <= 0) {
        return { total: 0, breakdown: [] };
    }

    let total = 0;
    const breakdown = [];

    // Days 1-3: Base price (same flat rate)
    const baseDays = Math.min(rentalDays, 3);
    if (baseDays > 0) {
        const baseTotal = basePrice * baseDays;
        total += baseTotal;
        breakdown.push({
            label: baseDays === 1 ? `Day 1` : `Days 1-${baseDays}`,
            days: baseDays,
            rate: basePrice,
            subtotal: baseTotal,
            tier: 'base'
        });
    }

    // Days 4+: +15% over base
    const extendedDays = Math.max(rentalDays - 3, 0);
    if (extendedDays > 0) {
        const extendedRate = Math.round(basePrice * 1.15);
        const extendedTotal = extendedRate * extendedDays;
        total += extendedTotal;
        breakdown.push({
            label: extendedDays === 1 ? `Day ${rentalDays}` : `Days 4-${rentalDays}`,
            days: extendedDays,
            rate: extendedRate,
            subtotal: extendedTotal,
            tier: 'extended',
            percentage: '+15%'
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
