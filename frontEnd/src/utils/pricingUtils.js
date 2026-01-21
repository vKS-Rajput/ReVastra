/**
 * Pricing utility functions for tiered rental pricing (Frontend)
 */

// Pricing constants
export const URGENT_FEE = 50; // ₹50 for urgent delivery
export const URGENT_THRESHOLD_DAYS = 2; // Orders with delivery < 2 days are urgent

/**
 * Calculate tiered rental price
 * Days 1-3: Base price
 * Days 4-5: +10% over base
 * Days 6+: +20% over base
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

    // Days 1-3: Base price
    const baseDays = Math.min(rentalDays, 3);
    if (baseDays > 0) {
        const baseTotal = basePrice * baseDays;
        total += baseTotal;
        breakdown.push({
            label: `Days 1-${baseDays}`,
            days: baseDays,
            rate: basePrice,
            subtotal: baseTotal,
            tier: 'base'
        });
    }

    // Days 4-5: +10% over base
    const extendedDays = Math.min(Math.max(rentalDays - 3, 0), 2);
    if (extendedDays > 0) {
        const extendedRate = Math.round(basePrice * 1.10);
        const extendedTotal = extendedRate * extendedDays;
        total += extendedTotal;
        breakdown.push({
            label: `Days 4-${3 + extendedDays}`,
            days: extendedDays,
            rate: extendedRate,
            subtotal: extendedTotal,
            tier: 'extended',
            percentage: '+10%'
        });
    }

    // Days 6+: +20% over base
    const longDays = Math.max(rentalDays - 5, 0);
    if (longDays > 0) {
        const longRate = Math.round(basePrice * 1.20);
        const longTotal = longRate * longDays;
        total += longTotal;
        breakdown.push({
            label: `Days 6-${rentalDays}`,
            days: longDays,
            rate: longRate,
            subtotal: longTotal,
            tier: 'long',
            percentage: '+20%'
        });
    }

    return { total, breakdown, rentalDays };
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
