const SearchResults = ({ results }) => {
  if (!results?.length) return null;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Results</h2>
      <div className="grid gap-4">
        {results.map((ingredient) => (
          <div
            key={ingredient.id}
            className="p-4 border rounded bg-white shadow-sm"
          >
            <div className="flex items-center gap-3">
              {ingredient.image && (
                <img
                  src={`https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}`}
                  alt={ingredient.name}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <div>
                <h3 className="text-lg font-medium">{ingredient.name}</h3>
                {ingredient.aisle && (
                  <p className="text-sm text-gray-600">
                    Aisle: {ingredient.aisle}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
