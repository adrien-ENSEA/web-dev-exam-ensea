
import path from "path"
import { readRecipes } from "../helpers/index.js"

const recipesPath = path.resolve("./data/recipes.json")

// GET All recipes
export const getRecipes = (req, res) => {
	try {
		const recipes = readRecipes(recipesPath) // Fresh data every time
		res.json(recipes)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}
