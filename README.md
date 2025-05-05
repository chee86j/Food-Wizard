# Food Wizard

A simple app to help you find the best food for you.

## Tech Stack

- Postgres
- Express.js
- React.js
- Node.js
- Tailwind CSS
- Vite
- Sequelize
- Axios
- Dotenv

## API: Spoonacular for Nutrition Data & Recipes

Spoonacular API for Nutrition Data & Recipes:

- Main docs: https://spoonacular.com/food-api/docs
- Search endpoint: https://spoonacular.com/food-api/docs#Search-Ingredients
- Details endpoint: https://spoonacular.com/food-api/docs#Get-Ingredient-Information
- Dashboard: https://spoonacular.com/food-api/console

## Server Setup & Environment Variables

### Database Setup

1. **Install PostgreSQL** if not already installed
2. **Create the Database**:
   ```
   psql -U postgres
   CREATE DATABASE food_wizard_db;
   \q
   ```
3. Tables will be automatically created when server starts

### Environment Variables

Create a `.env` file in the server directory with these variables:

```
PORT=5000
DB_NAME=food_wizard_db
DB_USERNAME=postgres_username
DB_PASSWORD=postgres_password
DB_HOST=localhost
DB_PORT=5432
SPOONACULAR_API_KEY=your_api_key_here
```

## Running the Application

This app uses a separate frontend & backend architecture:

1. **Backend (Express Server)**

   ```
   cd server
   npm start
   ```

2. **Frontend (React/Vite)**
   ```
   npm run dev
   ```
