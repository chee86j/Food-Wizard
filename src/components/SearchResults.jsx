const SearchResults = ({ results }) => {
  if (!results?.length) return null;

  return (
    <div className="p-4">
      <div className="grid gap-4">
        {results.map((result, index) => (
          <div key={index} className="p-3 border rounded bg-white">
            <h3 className="font-medium">{result.title}</h3>
            {/* Add More Reseult Details Here Later */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
