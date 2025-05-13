/* Receipt Card Component to Complement Product Card
 */
import { useState } from "react";
import { UtensilsCrossed, Check, AlertCircle } from "lucide-react";

const RecipeCard = ({ recipe, onRecipeClick }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div
      className="p-3 border hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={() => onRecipeClick(recipe.id)}
    >
      <div className="flex items-start gap-2">
        {!imageError && recipe.image ? (
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-16 h-16 object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="w-16 h-16 bg-gray-100 flex items-center justify-center">
            <UtensilsCrossed size={16} className="text-gray-400" />
          </div>
        )}

        <div className="flex-1">
          <h3 className="font-medium">{recipe.title}</h3>

          <div className="text-sm">
            <div className="flex justify-between">
              <span className="flex items-center">
                <Check size={14} className="text-green-500 mr-1" />
                Used: {recipe.usedIngredientCount}
              </span>
              <span className="flex items-center">
                <AlertCircle size={14} className="text-orange-500 mr-1" />
                Missing: {recipe.missedIngredientCount}
              </span>
            </div>

            {recipe.usedIngredients?.length > 0 && (
              <div className="mt-1">
                <span className="text-xs">Using: </span>
                <span className="text-xs">
                  {recipe.usedIngredients.join(", ")}
                </span>
              </div>
            )}

            {recipe.missedIngredients?.length > 0 && (
              <div className="mt-1">
                <span className="text-xs">Need: </span>
                <span className="text-xs">
                  {recipe.missedIngredients.join(", ")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
