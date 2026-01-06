import fs from "fs"

// Helper to read recipes
export const readRecipes = (recipesPath) => {
	const data = fs.readFileSync(recipesPath, "utf8")
	return JSON.parse(data)
}

// Helper to write recipes
export const writeRecipes = (recipes, recipesPath) => {
	fs.writeFileSync(recipesPath, JSON.stringify(recipes, null, 2), "utf8")
}
