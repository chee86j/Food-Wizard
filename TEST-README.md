# Food Wizard Testing

A testing guide for the Food Wizard application.

## Testing Framework

- Jest
- React Testing Library
- Supertest
- Mock Service Worker

## Test Organization

- `src/components/*.test.jsx`: Component tests
- `server/routes/api/*.test.js`: API endpoint tests
- `src/App.test.jsx`: Main application flow tests

## Running Tests

1. **All Tests**

   ```
   npm test
   ```

2. **Watch Mode**

   ```
   npm run test:watch
   ```

3. **Coverage Report**
   ```
   npm run test:coverage
   ```

## Main User Flow Coverage

- Searching for food ingredients
- Displaying nutritional information
- Showing recipe suggestions
- Viewing recipe details
- Accessing search history

## Mocking Strategy

- **External APIs**: All Spoonacular API calls are mocked
- **Database**: Sequelize models are mocked to avoid DB dependencies
- **Components**: Child components are mocked in App tests

## Test Coverage Areas

- Input validation
- API error handling
- Data visualization
- User interactions
- State management

## Extending Tests

When adding new features:

1. Create component tests for any new UI elements
2. Add API tests for new endpoints
3. Update integration tests for workflow changes
4. Follow existing patterns for assertions and mocks
