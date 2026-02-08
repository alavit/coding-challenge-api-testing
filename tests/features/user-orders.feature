Feature: User and Order Management
  As a client of the system
  I want to retrieve user information and manage orders
  So that I can track user activity and create new orders

  Scenario Outline: Retrieve user info, fetch active orders, and place new order
    Given a user with id <userId> exists in the system
    When the client retrieves user information for user <userId>
    Then the response status should be 200
    And the response should contain valid user data with id, name "<name>", and email "<email>"
    
    When the client retrieves active orders for user <userId>
    Then the response status should be 200
    And the response should contain a list of orders
    
    When the client creates a new order for user <userId> with amount <amount>
    Then the response status should be 200
    And the response should contain the new order with orderId, userId <userId>, and amount <amount>

    Examples:
      | userId | name  | email             | amount |
      | 1      | Alice | alice@example.com | 35.95  |
