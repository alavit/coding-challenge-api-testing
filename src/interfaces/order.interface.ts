/**
 * Order interface representing the response from Order Service
 * Used for both GET /orders and POST /orders endpoints
 */
export interface Order {
    /** Unique identifier for the order */
    orderId: number;
    /** User ID associated with this order */
    userId: number;
    /** Order total amount */
    amount: number;
}
