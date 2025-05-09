/* Container for Product Card */
import { useState } from "react";
import { formatNutritionValue } from "../utils/helpers";
import { ChevronDown, ChevronUp, Loader, Flame } from "lucide-react";

const ProductCard = ({
  item,
  isExpanded,
  onToggleExpand,
  nutritionData,
  isLoading,
}) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  // Image Size 100x100
  const imageUrl = item?.image
    ? `https://spoonacular.com/cdn/ingredients_100x100/${item.image}`
    : null;

  return (
    <div
      className="p-4 border rounded-md bg-white cursor-pointer transition-all duration-200 hover:shadow-md hover:border-blue-300"
      onClick={() => onToggleExpand(item.id)}
    >
      <div className="flex items-center gap-3">
        {!imageError && imageUrl ? (
          <img
            src={imageUrl}
            alt={item.name}
            className="w-16 h-16 object-cover rounded-md"
            onError={handleImageError}
          />
        ) : (
          <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-md">
            <span className="text-xs text-gray-400">No Image</span>
          </div>
        )}

        <div className="flex-1">
          <h3 className="font-medium text-lg">{item.name}</h3>
          {item.aisle && (
            <p className="text-sm text-gray-600 flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              {item.aisle}
            </p>
          )}
          {/* Display calories if available */}
          {item.calories && (
            <p className="text-sm text-orange-500 font-medium flex items-center mt-1">
              <Flame size={16} className="mr-1" />
              {item.calories} {item.calorieUnit || "kcal"} per serving
            </p>
          )}
        </div>

        <div className="text-blue-500">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t text-sm transition-all duration-300 ease-in-out">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader size={20} className="text-blue-500 animate-spin" />
            </div>
          ) : nutritionData ? (
            <div>
              <h4 className="font-medium mb-2 text-blue-600">
                Nutritional Info (per Serving)
              </h4>
              <div className="grid grid-cols-2 gap-2 bg-blue-50 p-3 rounded-md">
                {nutritionData.nutrition?.nutrients
                  ?.slice(0, 6)
                  .map((nutrient) => (
                    <div key={nutrient.name} className="flex justify-between">
                      <span className="text-gray-700">{nutrient.name}</span>
                      <span className="font-medium">
                        {formatNutritionValue(nutrient)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <p className="p-3 bg-gray-50 text-center rounded-md">
              No Nutritional Data Found
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductCard;
