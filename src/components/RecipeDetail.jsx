import { useState, useEffect } from "react";
import {
  Loader,
  X,
  Clock,
  UtensilsCrossed,
  Heart,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { API_BASE } from "../utils/api"; // Centralized API base URL
import { stripHtmlTags } from "../utils/helpers"; // Render API HTML as safe text

const RecipeDetail = ({ recipeId, onClose }) => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      if (!recipeId) return;

      setLoading(true);
      try {
        // Use centralized API base to avoid hard-coded localhost
        const response = await fetch(`${API_BASE}/api/recipes/${recipeId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch recipe details");
        }

        const data = await response.json();
        setRecipe(data);
      } catch (err) {
        console.error("Error fetching recipe details:", err);
        setError("Failed to load recipe details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [recipeId]);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md md:max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 p-3 border-b flex justify-between items-center">
          <h2 className="text-lg md:text-xl font-bold truncate">
            {loading ? "Recipe Details" : recipe?.title}
          </h2>
          <button onClick={onClose} className="p-1">
            <X size={18} />
          </button>
        </div>

        <div className="p-4">
          {loading && (
            <div className="flex justify-center items-center py-12">
              <Loader size={24} className="animate-spin mr-2" />
              <span>Loading Recipe Details...</span>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center py-8 text-red-500">
              <AlertCircle size={20} className="mr-2" />
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && recipe && (
            <>
              {recipe.image && (
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-48 md:h-64 object-cover mb-4 rounded"
                />
              )}

              <div className="flex flex-wrap gap-2 mb-5">
                {recipe.readyInMinutes && (
                  <span className="inline-flex items-center text-xs bg-gray-100 px-2 py-1 rounded">
                    <Clock size={14} className="mr-1" />
                    {recipe.readyInMinutes} min
                  </span>
                )}
                {recipe.servings && (
                  <span className="inline-flex items-center text-xs bg-gray-100 px-2 py-1 rounded">
                    <UtensilsCrossed size={14} className="mr-1" />
                    {recipe.servings} servings
                  </span>
                )}
                {recipe.aggregateLikes > 0 && (
                  <span className="inline-flex items-center text-xs bg-gray-100 px-2 py-1 rounded">
                    <Heart size={14} className="mr-1 text-red-500" />
                    {recipe.aggregateLikes}
                  </span>
                )}
              </div>

              {recipe.summary && (
                <div className="mb-6 text-left">
                  <h3 className="font-medium text-sm mb-2 border-b pb-1">
                    Summary
                  </h3>
                  {/*
                    Avoid dangerouslySetInnerHTML to reduce XSS risk since the
                    API returns HTML. We render a plain-text version instead.
                  */}
                  <div className="text-xs md:text-sm leading-relaxed">
                    {stripHtmlTags(recipe.summary)}
                  </div>
                </div>
              )}

              {recipe.extendedIngredients?.length > 0 && (
                <div className="mb-6 text-left">
                  <h3 className="font-medium text-sm mb-2 border-b pb-1">
                    Ingredients
                  </h3>
                  <ul className="list-disc pl-5 text-xs md:text-sm space-y-1">
                    {recipe.extendedIngredients.map((ingredient, index) => (
                      <li key={index}>{ingredient.original}</li>
                    ))}
                  </ul>
                </div>
              )}

              {recipe.analyzedInstructions?.[0]?.steps?.length > 0 && (
                <div className="mb-6 text-left">
                  <h3 className="font-medium text-sm mb-2 border-b pb-1">
                    Instructions
                  </h3>
                  <ol className="list-decimal pl-5 text-xs md:text-sm">
                    {recipe.analyzedInstructions[0].steps.map((step) => (
                      <li key={step.number} className="mb-3 leading-relaxed">
                        {step.step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {recipe.nutrition?.nutrients && (
                <div className="text-left">
                  <h3 className="font-medium text-sm mb-2 border-b pb-1">
                    Nutrition Facts
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {recipe.nutrition.nutrients.slice(0, 6).map((nutrient) => (
                      <div
                        key={nutrient.name}
                        className="flex justify-between p-1 border-b"
                      >
                        <span>{nutrient.name}</span>
                        <span>
                          {nutrient.amount} {nutrient.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
