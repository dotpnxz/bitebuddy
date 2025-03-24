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
          : "Something went wrong. Check your internet connection or try again later."
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
    <div className="flex flex-col items-center justify-center h-screen w-full text-center">
      {showIntro && (
        <p className="text-2xl font-semibold text-gray-700 max-w-lg relative left-[45rem]">
          From breakfast to dinner, Italian to Thai, keto to vegan—BiteBuddy finds
          meals that match your taste and lifestyle!
        </p>
      )}

      <div className="absolute bottom-[5rem] left-1/2 transform -translate-x-1/2 w-[50rem]">
        <input
          type="text"
          placeholder="Ask anything..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full px-6 py-4 text-lg text-gray-500 bg-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>

      {loading && <p className="text-gray-600 mt-4 relative left-[45rem]">Fetching recipes...</p>}
      
      {error && (
        <p className="text-red-500 mt-4 relative left-[45rem]">
          {error} <br />
          Need ideas? Try searching for <strong>"Italian"</strong> or <strong>"chicken recipes"</strong>.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-[5rem] max-w-6xl">
        {recipes.map((recipe, index) => (
          <div key={index} className="bg-white p-3 rounded-lg shadow-lg max-w-[40rem] text-sm max-h-[35rem] overflow-y-auto relative left-[25rem]">
            <h2 className="text-lg font-bold">{recipe.title}</h2>
            {recipe.image && <img src={recipe.image} alt={recipe.title} className="w-full rounded-lg mt-2" />}
            <p className="text-gray-700 mt-1"><strong>Cuisine:</strong> {recipe.cuisine.join(", ")}</p>
            <h3 className="font-semibold mt-2">Ingredients:</h3>
            <ul className="list-disc list-inside text-gray-600">
              {recipe.ingredients.map((ingredient, idx) => (
                <li key={idx}>{ingredient}</li>
              ))}
            </ul>
            <h3 className="font-semibold mt-2">Instructions:</h3>
            <p className="text-gray-600">{recipe.instructions}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
