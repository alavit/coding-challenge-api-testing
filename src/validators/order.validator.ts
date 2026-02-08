import { Order } from '../interfaces/order.interface';
import { ValidationResult } from './validation-result.interface';

/**
 * Validates that the given object conforms to the Order interface
 * Performs runtime type checking for API response validation
 * 
 * @param data - The data to validate
 * @returns ValidationResult with isValid flag and any error messages
 */
export function validateOrder(data: unknown): ValidationResult {
    const errors: string[] = [];

    // Check if data is an object
    if (typeof data !== 'object' || data === null) {
        return { isValid: false, errors: ['Response is not an object'] };
    }

    const order = data as Record<string, unknown>;

    // Validate 'orderId' field exists and is a number
    if (!('orderId' in order)) {
        errors.push("Missing required field: 'orderId'");
    } else if (typeof order.orderId !== 'number') {
        errors.push(`Field 'orderId' must be a number, got ${typeof order.orderId}`);
    }

    // Validate 'userId' field exists and is a number
    if (!('userId' in order)) {
        errors.push("Missing required field: 'userId'");
    } else if (typeof order.userId !== 'number') {
        errors.push(`Field 'userId' must be a number, got ${typeof order.userId}`);
    }

    // Validate 'amount' field exists and is a number
    if (!('amount' in order)) {
        errors.push("Missing required field: 'amount'");
    } else if (typeof order.amount !== 'number') {
        errors.push(`Field 'amount' must be a number, got ${typeof order.amount}`);
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Validates an array of orders
 * 
 * @param data - The array to validate
 * @returns ValidationResult with isValid flag and any error messages
 */
export function validateOrderArray(data: unknown): ValidationResult {
    const errors: string[] = [];

    // Check if data is an array
    if (!Array.isArray(data)) {
        return { isValid: false, errors: ['Response is not an array'] };
    }

    // Validate each order in the array
    data.forEach((item, index) => {
        const result = validateOrder(item);
        if (!result.isValid) {
            errors.push(`Order at index ${index}: ${result.errors.join(', ')}`);
        }
    });

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Type guard to check if data is a valid Order
 * 
 * @param data - The data to check
 * @returns True if data conforms to Order interface
 */
export function isOrder(data: unknown): data is Order {
    return validateOrder(data).isValid;
}

/**
 * Type guard to check if data is a valid Order array
 * 
 * @param data - The data to check
 * @returns True if data is an array of valid Orders
 */
export function isOrderArray(data: unknown): data is Order[] {
    return validateOrderArray(data).isValid;
}
