// ============================================
// IMPORTS - Modules nécessaires
// ============================================
import { getAllRecipes, createRecipe } from "./api.js"
import { renderRecipeCard, clearRecipesList } from "./ui.js"

// ============================================
// INITIALISATION DE L'APPLICATION
// ============================================
// Cette fonction est appelée automatiquement au chargement de la page
// Elle charge et affiche toutes les recettes

document.addEventListener("DOMContentLoaded", () => {
	// console.log("Application chargée")
	loadRecipes()
	setupEventListeners()
})

// ============================================
// CHARGER ET AFFICHER LES RECETTES
// ============================================
// Cette fonction est fournie comme EXEMPLE de référence
// Étudiez-la pour comprendre le pattern async/await et le flow de données

const loadRecipes = async () => {
	try {
		// 1. Appeler l'API pour récupérer toutes les recettes
		const recipes = await getAllRecipes()

		// console.log("Recettes chargées:", recipes)

		// 2. Afficher les recettes dans la grid
		displayRecipes(recipes)
	} catch (error) {
		console.error("Erreur lors du chargement des recettes:", error)
		alert(
			"Impossible de charger les recettes. Vérifiez que le serveur est démarré."
		)
	}
}

// ============================================
// AFFICHER LES RECETTES DANS LA GRID
// ============================================
// Fonction fournie - génère le HTML pour toutes les recettes

const displayRecipes = (recipes) => {
	// Récupérer le conteneur où afficher les recettes
	const recipesContainer = document.getElementById("recipes-container")

	// Vider le conteneur avant d'ajouter les nouvelles recettes
	clearRecipesList(recipesContainer)

	// Si aucune recette, afficher un message
	if (recipes.length === 0) {
		recipesContainer.innerHTML = `
			<div class="col-12">
				<div class="alert alert-info text-center" role="alert">
					Aucune recette disponible. Ajoutez-en une !
				</div>
			</div>
		`
		return
	}

	// Générer et afficher chaque recette
	recipes.forEach((recipe) => {
		const cardHTML = renderRecipeCard(recipe)
		recipesContainer.innerHTML += cardHTML
		console.log("Recette:", recipe)
	})
}

// ============================================
// CONFIGURATION DES EVENT LISTENERS
// ============================================

const setupEventListeners = () => {
	// Event listener pour le formulaire d'ajout de recette
	const addRecipeForm = document.getElementById("addRecipeForm")

	if (addRecipeForm) {
		addRecipeForm.addEventListener("submit", handleAddRecipe)
	}
}

// ============================================
// AJOUTER UNE NOUVELLE RECETTE
// ============================================
// TODO: Compléter cette fonction pour gérer l'ajout d'une recette
// Cette fonction est appelée quand l'utilisateur soumet le formulaire dans le modal

export const handleAddRecipe = async (event) => {
	event.preventDefault()

	try {
		const name = document.getElementById("recipeName").value
		const ingredients = document
			.getElementById("recipeIngredients")
			.value.split("\n")
			.map((i) => i.trim())
			.filter((i) => i !== "")
		const instructions = document.getElementById("recipeInstructions").value
		const prepTime = parseInt(document.getElementById("recipePrepTime").value)
		const image = document.getElementById("imageUrl").value

		const newRecipe = {
			name,
			ingredients,
			instructions,
			prepTime,
			image,
		}

		await createRecipe(newRecipe)

		const modalElement = document.getElementById("addRecipeModal")
		const modal = bootstrap.Modal.getInstance(modalElement)
		modal.hide()

		alert("Recette ajoutée avec succès !")
		loadRecipes()
		event.target.reset()
	} catch (error) {
		console.error("Erreur lors de l'ajout de la recette:", error)
		alert("Erreur lors de l'ajout de la recette. Veuillez réessayer.")
	}
}
