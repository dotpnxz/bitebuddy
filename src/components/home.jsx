import React, { useState } from "react";

const Home = () => {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);  // Now an array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setRecipes([]);

    try {
      const response = await fetch(`http://127.0.0.1:5000/search?query=${query}`);
      const data = await response.json();

      if (response.ok) {
        setRecipes(data);  // Expecting an array now
      } else {
        setError(data.error || "Failed to fetch recipes");
      }
    } catch (err) {
      setError("Something went wrong! Try again.");
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
      {!recipes.length ? (
        <>
          <p className="text-2xl font-semibold text-gray-700 max-w-lg relative left-[45rem]">
            From breakfast to dinner, Italian to Thai, keto to vegan—BiteBuddy finds
            meals that match your taste and lifestyle!
          </p>
          <div className="absolute bottom-[10rem] left-1/2 transform -translate-x-1/2 w-[50rem]">
            <input
              type="text"
              placeholder="Ask anything..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-6 py-4 text-lg text-gray-500 bg-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[10rem] max-w-6xl">
          {recipes.map((recipe, index) => (
            <div key={index} className="bg-white p-3 rounded-lg shadow-lg max-w-[40rem] text-sm max-h-[40rem] overflow-y-auto relative left-[25rem]">
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
              <button 
                onClick={() => setRecipes([])}
                className="mt-2 bg-black-500 text-black px-3 py-1 rounded-lg hover:bg-black-600 text-xs"
              >
                Search Again
              </button>
              
            </div>
            
          ))}
        </div>
      )}
      {loading && <p className="text-gray-600 mt-4 relative left-[45rem]">Fetching recipes...</p>}
      {error && <p className="text-red-500 mt-4 relative left-[45rem]">{error}</p>}
    </div>
  );
};

export default Home;
