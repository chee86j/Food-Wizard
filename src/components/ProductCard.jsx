/* Container for Product Card */
import { useState } from "react";
import { formatNutritionValue } from "../utils/helpers";

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
      className="p-3 border bg-white cursor-pointer transition-transform duration-200 hover:scale-110"
      onClick={() => onToggleExpand(item.id)}
    >
      <div className="flex items-center gap-2">
        {!imageError && imageUrl ? (
          <img
            src={imageUrl}
            alt={item.name}
            className="w-12 h-12 object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="w-12 h-12 bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">No Image Available</span>
          </div>
        )}

        <div>
          <h3 className="font-medium">{item.name}</h3>
          {item.aisle && <p className="text-xs text-gray-600">{item.aisle}</p>}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-2 pt-2 border-t text-sm">
          {isLoading ? (
            <p className="text-center py-2">Loading...</p>
          ) : nutritionData ? (
            <div>
              <h4 className="font-medium mb-1">
                Nutritional Info (per Serving)
              </h4>
              <div className="grid grid-cols-2 gap-1">
                {nutritionData.nutrition?.nutrients
                  ?.slice(0, 4)
                  .map((nutrient) => (
                    <div key={nutrient.name} className="flex justify-between">
                      <span>{nutrient.name}</span>
                      <span>{formatNutritionValue(nutrient)}</span>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <p>No Nutritional Data Found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductCard;
