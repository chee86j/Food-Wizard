/* Display for Recipe Results
 */
import RecipeCard from "./RecipeCard";
import { Loader, BookX, Utensils } from "lucide-react";

const RecipeResults = ({ recipes, isLoading }) => {
  if (isLoading) {
    return (
      <div>
        <h2 className="text-lg font-medium mb-2 flex items-center">
          <Utensils size={18} className="mr-2" /> Recipe Suggestions
        </h2>
        <div className="p-4 text-center flex justify-center items-center">
          <Loader size={20} className="animate-spin mr-2" />
          <span>Loading Recipes...</span>
        </div>
      </div>
    );
  }

  if (!recipes?.length) {
    return (
      <div>
        <h2 className="text-lg font-medium mb-2 flex items-center">
          <Utensils size={18} className="mr-2" /> Recipe Suggestions
        </h2>
        <div className="p-2 text-gray-500 flex items-center justify-center">
          <BookX size={18} className="mr-2" />
          <span>No Recipes Available</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-medium mb-2 flex items-center">
        <Utensils size={18} className="mr-2" /> Recipe Suggestions
      </h2>
      <div className="grid gap-2">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default RecipeResults;
