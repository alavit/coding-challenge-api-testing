/**
 * User interface representing the response from User Service
 * GET /users/:id endpoint
 */
export interface User {
    /** Unique identifier for the user */
    id: number;
    /** User's display name */
    name: string;
    /** User's email address */
    email: string;
}
