import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { request, APIRequestContext, APIResponse } from '@playwright/test';
import { expect } from '@playwright/test';
import { validateUser } from '../../src/validators/user.validator';
import { validateOrder, validateOrderArray } from '../../src/validators/order.validator';
import { User } from '../../src/interfaces/user.interface';
import { Order } from '../../src/interfaces/order.interface';

// Configuration for service URLs
const USER_SERVICE_URL = 'http://localhost:3001';
const ORDER_SERVICE_URL = 'http://localhost:3002';

// Test context to store state between steps
interface TestContext {
    apiContext: APIRequestContext;
    response: APIResponse | null;
    responseBody: unknown;
    userId: number;
}

let ctx: TestContext;

// Setup: Create API request context before each scenario
Before(async function () {
    ctx = {
        apiContext: await request.newContext(),
        response: null,
        responseBody: null,
        userId: 0
    };
});

// Teardown: Dispose API context after each scenario
After(async function () {
    if (ctx.apiContext) {
        await ctx.apiContext.dispose();
    }
});

// ============================================
// GIVEN Steps
// ============================================

Given('a user with id {int} exists in the system', async function (userId: number) {
    // Store the user ID for subsequent steps
    // This step establishes the precondition that the user exists
    ctx.userId = userId;

    // Assertion: Verify user ID is a positive number
    // This ensures we have valid test data before proceeding
    expect(userId).toBeGreaterThan(0);
});

// ============================================
// WHEN Steps
// ============================================

When('the client retrieves user information for user {int}', async function (userId: number) {
    // Send GET request to User Service to retrieve user information
    ctx.response = await ctx.apiContext.get(`${USER_SERVICE_URL}/users/${userId}`);

    // Parse response body for subsequent assertions
    ctx.responseBody = await ctx.response.json();
});

When('the client retrieves active orders for user {int}', async function (userId: number) {
    // Send GET request to Order Service with userId query parameter
    ctx.response = await ctx.apiContext.get(`${ORDER_SERVICE_URL}/orders`, {
        params: { userId: userId.toString() }
    });

    // Parse response body for subsequent assertions
    ctx.responseBody = await ctx.response.json();
});

When('the client creates a new order for user {int} with amount {float}', async function (userId: number, amount: number) {
    // Send POST request to Order Service to create a new order
    ctx.response = await ctx.apiContext.post(`${ORDER_SERVICE_URL}/orders`, {
        data: {
            userId: userId,
            amount: amount
        }
    });

    // Parse response body for subsequent assertions
    ctx.responseBody = await ctx.response.json();
});

// ============================================
// THEN Steps
// ============================================

Then('the response status should be {int}', async function (expectedStatus: number) {
    // Assertion: Verify HTTP status code matches expected value
    // This is a critical check to ensure the API responded successfully
    expect(ctx.response?.status()).toBe(expectedStatus);
});

Then('the response should contain valid user data with id, name {string}, and email {string}', async function (expectedName: string, expectedEmail: string) {
    const user = ctx.responseBody as User;

    // Assertion: Validate response structure using interface-based validator
    // This ensures the response conforms to the expected User interface schema
    const validationResult = validateUser(ctx.responseBody);
    expect(validationResult.isValid).toBe(true);

    // Assertion: Verify user ID matches the expected value
    // This confirms we received data for the correct user
    expect(user.id).toBe(ctx.userId);

    // Assertion: Verify user name matches expected value from test data
    // This validates the correctness of the user's name field
    expect(user.name).toBe(expectedName);

    // Assertion: Verify user email matches expected value from test data
    // This validates the correctness of the user's email field
    expect(user.email).toBe(expectedEmail);
});

Then('the response should contain a list of orders', async function () {
    // Assertion: Verify response is an array
    // Orders endpoint should always return an array, even if empty
    expect(Array.isArray(ctx.responseBody)).toBe(true);

    const orders = ctx.responseBody as Order[];

    // Assertion: Validate each order in the array using interface-based validator
    // This ensures all orders conform to the expected Order interface schema
    const validationResult = validateOrderArray(ctx.responseBody);
    expect(validationResult.isValid).toBe(true);

    // Assertion: If orders exist, verify they belong to the correct user
    // This ensures data integrity - orders should only be for the requested user
    if (orders.length > 0) {
        orders.forEach((order, index) => {
            expect(order.userId).toBe(ctx.userId);
        });
    }
});

Then('the response should contain the new order with orderId, userId {int}, and amount {float}', async function (expectedUserId: number, expectedAmount: number) {
    const order = ctx.responseBody as Order;

    // Assertion: Validate response structure using interface-based validator
    // This ensures the created order conforms to the expected Order interface schema
    const validationResult = validateOrder(ctx.responseBody);
    expect(validationResult.isValid).toBe(true);

    // Assertion: Verify orderId exists and is a positive number
    // New orders must have a valid unique identifier assigned by the system
    expect(order.orderId).toBeDefined();
    expect(order.orderId).toBeGreaterThan(0);

    // Assertion: Verify userId matches the user who placed the order
    // This ensures the order is correctly associated with the requesting user
    expect(order.userId).toBe(expectedUserId);

    // Assertion: Verify amount matches the requested order amount
    // This confirms the order was created with the correct total
    expect(order.amount).toBe(expectedAmount);
});
