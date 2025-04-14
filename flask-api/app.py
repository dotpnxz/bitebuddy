from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)  # Allow frontend to communicate with backend

SPOONACULAR_API_KEY = "10d19486498046239b9ea7dcb0c7a252"

@app.route('/')
def index():
    return "Welcome to the Recipe API!"  # Or any other content you want to display

@app.route('/search', methods=['GET'])
def search_recipe():
    query = request.args.get('query')
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400

    # Add the 'number' parameter to limit the initial search results
    search_url = f"https://api.spoonacular.com/recipes/complexSearch?query={query}&number=3&apiKey={SPOONACULAR_API_KEY}"
    search_response = requests.get(search_url)

    # Print response for debugging
    print("Search API Response Code:", search_response.status_code)
    print("Search API Response:", search_response.text)

    if search_response.status_code != 200:
        return jsonify({"error": "Failed to fetch data from Spoonacular"}), 500

    search_data = search_response.json()

    if "results" not in search_data or not search_data["results"]:
        return jsonify({"error": "No recipes found"}), 404

    recipes = []

    for recipe in search_data["results"]:
        recipe_id = recipe["id"]
        details_url = f"https://api.spoonacular.com/recipes/{recipe_id}/information?includeNutrition=false&apiKey={SPOONACULAR_API_KEY}"
        details_response = requests.get(details_url)

        # Print response for debugging
        print(f"Details API Response for {recipe_id}: {details_response.status_code}")
        print("Details API Response:", details_response.text)

        if details_response.status_code == 200:
            recipe_data = details_response.json()

            recipes.append({
                "title": recipe_data.get("title", "No title"),
                "image": recipe_data.get("image", ""),
                "cuisine": recipe_data.get("cuisines", ["Unknown"]),
                "ingredients": [ingredient["original"] for ingredient in recipe_data.get("extendedIngredients", [])],
                "instructions": recipe_data.get("instructions", "No instructions available.")
            })

    return jsonify(recipes)

if __name__ == '__main__':
    app.run(debug=True, port=5000)