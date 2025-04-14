import React, { useState } from "react";

const Home = () => {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showIntro, setShowIntro] = useState(true);

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Please enter a food name. Try 'pasta' or 'chicken'.");
      return;
    }

    setLoading(true);
    setError(null);
    setShowIntro(false);

    try {
      const response = await fetch(`http://127.0.0.1:5000/search?query=${query}`);
      if (!response.ok) throw new Error("Failed to fetch recipes.");

      const data = await response.json();

      if (!data || data.length === 0) {
        throw new Error("No matching recipes found.");
      }

      setRecipes(data);
    } catch (err) {
      setError(
        err.message.includes("No matching recipes")
          ? "No matching recipes found. Try more general terms like 'pasta' or 'salad'."
          : "No matching recipes."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full text-center">
      {showIntro && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <p className="text-2xl font-semibold text-gray-700 max-w-lg text-center">
            From breakfast to dinner, Italian to Thai, keto to vegan—BiteBuddy finds
            meals that match your taste and lifestyle!
          </p>
        </div>
      )}

      <div className="absolute bottom-[2rem] left-1/2 transform -translate-x-1/2 w-full max-w-[30rem] sm:max-w-[40rem] md:max-w-[50rem]">
        <input
          type="text"
          placeholder="Ask anything..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg text-gray-500 bg-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>

      {loading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <p className="text-gray-600 text-center">Fetching recipes...</p>
        </div>
      )}
      
      {error && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <p className="text-red-500 text-center max-w-[30rem] sm:max-w-[40rem] md:max-w-[50rem]">
            {error} <br />
            Need ideas? Try searching for <strong>"Italian"</strong> or <strong>"chicken recipes"</strong>.
          </p>
        </div>
      )}

      {!error && recipes.length > 0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 justify-items-center">
            {recipes.map((recipe, index) => (
              <div key={index} className="bg-white p-3 sm:p-4 rounded-lg shadow-lg w-full max-w-[25rem] text-sm max-h-[30rem] overflow-y-auto">
                <h2 className="text-base sm:text-lg font-bold">{recipe.title}</h2>
                {recipe.image && <img src={recipe.image} alt={recipe.title} className="w-full rounded-lg mt-2" />}
                <p className="text-gray-700 mt-1 text-sm"><strong>Cuisine:</strong> {recipe.cuisine.join(", ")}</p>
                <h3 className="font-semibold mt-2 text-sm">Ingredients:</h3>
                <ul className="list-disc list-inside text-gray-600 text-sm">
                  {recipe.ingredients.map((ingredient, idx) => (
                    <li key={idx}>{ingredient}</li>
                  ))}
                </ul>
                <h3 className="font-semibold mt-2 text-sm">Instructions:</h3>
                <p className="text-gray-600 text-sm">{recipe.instructions}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
