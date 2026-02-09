import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { request, APIRequestContext, APIResponse, expect } from '@playwright/test';
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
    responseBody: any;
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
    if (ctx && ctx.apiContext) {
        await ctx.apiContext.dispose();
    }
});

// ============================================
// GIVEN Steps
// ============================================

Given('a user with id {int} exists in the system', async function (userId: number) {
    ctx.userId = userId;
    // Verify that the user ID provided is valid (positive integer)
    expect(userId).toBeGreaterThan(0);
});

// ============================================
// WHEN Steps
// ============================================

When('the client retrieves user information for user {int}', async function (userId: number) {
    ctx.response = await ctx.apiContext.get(`${USER_SERVICE_URL}/users/${userId}`);
    ctx.responseBody = await ctx.response.json();
});

When('the client retrieves active orders for user {int}', async function (userId: number) {
    ctx.response = await ctx.apiContext.get(`${ORDER_SERVICE_URL}/orders`, {
        params: { userId: userId.toString() }
    });
    ctx.responseBody = await ctx.response.json();
});

When('the client creates a new order for user {int} with amount {float}', async function (userId: number, amount: number) {
    ctx.response = await ctx.apiContext.post(`${ORDER_SERVICE_URL}/orders`, {
        data: {
            userId: userId,
            amount: amount
        }
    });
    ctx.responseBody = await ctx.response.json();
});

// ============================================
// THEN Steps
// ============================================

Then('the response status should be {int}', async function (expectedStatus: number) {
    // Verify that the HTTP response status code matches the expected status
    expect(ctx.response?.status()).toBe(expectedStatus);
});

Then('the response should contain valid user data with id, name {string}, and email {string}', async function (expectedName: string, expectedEmail: string) {
    const user = ctx.responseBody as User;
    const validationResult = validateUser(ctx.responseBody);

    // Custom message for assertion failure to provide more context
    if (!validationResult.isValid) {
        console.error('Validation errors:', validationResult.errors);
    }
    // Verify that the response structure matches the User interface
    expect(validationResult.isValid).toBe(true);

    // Verify that the returned user data matches the requested user's details
    expect(user.id).toBe(ctx.userId);
    expect(user.name).toBe(expectedName);
    expect(user.email).toBe(expectedEmail);
});

Then('the response should contain a list of orders', async function () {
    // Verify that the response body is an array
    expect(Array.isArray(ctx.responseBody)).toBe(true);

    const validationResult = validateOrderArray(ctx.responseBody);
    if (!validationResult.isValid) {
        console.error('Validation errors:', validationResult.errors);
    }
    // Verify that all items in the array match the Order interface structure
    expect(validationResult.isValid).toBe(true);

    if (ctx.responseBody.length > 0) {
        ctx.responseBody.forEach((order: Order) => {
            // Verify that each order belongs to the correct user
            expect(order.userId).toBe(ctx.userId);
        });
    }
});

Then('the response should contain the new order with orderId, userId {int}, and amount {float}', async function (expectedUserId: number, expectedAmount: number) {
    const order = ctx.responseBody as Order;
    const validationResult = validateOrder(ctx.responseBody);

    if (!validationResult.isValid) {
        console.error('Validation errors:', validationResult.errors);
    }
    // Verify that the response matches the Order interface structure
    expect(validationResult.isValid).toBe(true);

    // Verify that a valid Order ID was generated
    expect(order.orderId).toBeDefined();
    expect(order.orderId).toBeGreaterThan(0);

    // Verify that the order details match the input data
    expect(order.userId).toBe(expectedUserId);
    expect(order.amount).toBe(expectedAmount);
});
