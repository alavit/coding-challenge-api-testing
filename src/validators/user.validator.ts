import { User } from '../interfaces/user.interface';
import { ValidationResult } from './validation-result.interface';

/**
 * Validates that the given object conforms to the User interface
 * Performs runtime type checking for API response validation
 * 
 * @param data - The data to validate
 * @returns ValidationResult with isValid flag and any error messages
 */
export function validateUser(data: unknown): ValidationResult {
    const errors: string[] = [];

    // Check if data is an object
    if (typeof data !== 'object' || data === null) {
        return { isValid: false, errors: ['Response is not an object'] };
    }

    const user = data as Record<string, unknown>;

    // Validate 'id' field exists and is a number
    if (!('id' in user)) {
        errors.push("Missing required field: 'id'");
    } else if (typeof user.id !== 'number') {
        errors.push(`Field 'id' must be a number, got ${typeof user.id}`);
    }

    // Validate 'name' field exists and is a string
    if (!('name' in user)) {
        errors.push("Missing required field: 'name'");
    } else if (typeof user.name !== 'string') {
        errors.push(`Field 'name' must be a string, got ${typeof user.name}`);
    }

    // Validate 'email' field exists and is a string
    if (!('email' in user)) {
        errors.push("Missing required field: 'email'");
    } else if (typeof user.email !== 'string') {
        errors.push(`Field 'email' must be a string, got ${typeof user.email}`);
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Type guard to check if data is a valid User
 * 
 * @param data - The data to check
 * @returns True if data conforms to User interface
 */
export function isUser(data: unknown): data is User {
    return validateUser(data).isValid;
}
