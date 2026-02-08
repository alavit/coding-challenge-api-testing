/**
 * Validation result containing success status and optional error message
 */
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}
