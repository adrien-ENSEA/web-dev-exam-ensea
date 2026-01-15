// ============================================
// IMPORTS - Modules nécessaires
// ============================================
import { getOneRecipe, deletOneRecipe, updateRecipe } from "./api.js"
import { renderRecipeCard, renderSingleRecipe } from "./ui.js"

let currentRecipe = null

const loadRecipe = async (recipeId) => {
	try {
		// Appeler l'API pour récupérer la recette par son ID
		const recipe = await getOneRecipe(recipeId)
		currentRecipe = recipe

		if (recipe) {
			// Remplir les éléments existants dans la page
			document.getElementById("recipe-name").textContent = recipe.name
			document.getElementById("recipe-preptime").innerHTML = `
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clock" viewBox="0 0 16 16">
					<path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
					<path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
				</svg>
				${recipe.prepTime} min
			`
			document.getElementById("recipe-instructions").textContent =
				recipe.instructions
			document.getElementById("recipe-id").textContent = recipe.id

			// Remplir les ingrédients
			const ingredientsList = document.getElementById("recipe-ingredients")
			ingredientsList.innerHTML = recipe.ingredients
				.map((ing) => `<li class="mb-2 text-muted">• ${ing}</li>`)
				.join("")

			// Gérer l'image si elle existe
			let recipeImg = document.getElementById("recipe-image")
			if (!recipeImg) {
				// Créer l'élément image s'il n'existe pas encore dans le HTML fourni
				const cardBody = document.querySelector(".card-body")
				recipeImg = document.createElement("img")
				recipeImg.id = "recipe-image"
				recipeImg.className = "card-img-top"
				recipeImg.style.maxHeight = "300px"
				recipeImg.style.objectFit = "cover"
				document.querySelector(".card").insertBefore(recipeImg, cardBody)
			}
			recipeImg.src =
				recipe.image ||
				"https://images.pexels.com/photos/5190684/pexels-photo-5190684.jpeg"
			recipeImg.alt = recipe.name
		} else {
			showError("Recette non trouvée.")
		}
	} catch (error) {
		console.error("Erreur lors du chargement de la recette:", error.message)
		showError(
			"Impossible de charger la recette. Vérifiez que le serveur est démarré."
		)
	}
}

const showError = (message) => {
	document.getElementById("recipe-detail").classList.add("d-none")
	const errorContainer = document.getElementById("error-message")
	errorContainer.classList.remove("d-none")
	document.getElementById("error-text").textContent = message
}

// ============================================
// INITIALISATION DE L'APPLICATION
// ============================================
// Cette fonction est appelée automatiquement au chargement de la page
// Elle charge et affiche toutes les recettes

const setupEventListeners = () => {
	const loader = document.getElementById("loading-spinner")
	const recipeDetail = document.getElementById("recipe-detail")
	const deleteButton = document.getElementById("delete-recipe-btn")
	const editButton = document.getElementById("edit-recipe-btn")
	const editForm = document.getElementById("editRecipeForm")

	if (loader) {
		loader.classList.add("d-none")
	}
	if (recipeDetail) {
		recipeDetail.classList.remove("d-none")
	}

	if (editButton) {
		editButton.addEventListener("click", () => {
			if (currentRecipe) {
				document.getElementById("editRecipeName").value = currentRecipe.name
				document.getElementById("editRecipeIngredients").value =
					currentRecipe.ingredients.join("\n")
				document.getElementById("editRecipeInstructions").value =
					currentRecipe.instructions
				document.getElementById("editRecipePrepTime").value =
					currentRecipe.prepTime
				document.getElementById("editRecipeImageUrl").value =
					currentRecipe.image || ""
			}
		})
	}

	if (editForm) {
		editForm.addEventListener("submit", async (e) => {
			e.preventDefault()
			try {
				const updatedData = {
					name: document.getElementById("editRecipeName").value,
					ingredients: document
						.getElementById("editRecipeIngredients")
						.value.split("\n")
						.map((i) => i.trim())
						.filter((i) => i !== ""),
					instructions: document.getElementById("editRecipeInstructions").value,
					prepTime: parseInt(document.getElementById("editRecipePrepTime").value),
					image: document.getElementById("editRecipeImageUrl").value,
				}

				const urlParams = new URLSearchParams(window.location.search)
				const recipeId = urlParams.get("id")

				await updateRecipe(recipeId, updatedData)

				const modalElement = document.getElementById("editRecipeModal")
				const modal = bootstrap.Modal.getInstance(modalElement)
				modal.hide()

				alert("Recette mise à jour avec succès !")
				loadRecipe(recipeId) // Recharger les détails
			} catch (error) {
				console.error("Erreur lors de la mise à jour:", error)
				alert("Erreur lors de la mise à jour de la recette.")
			}
		})
	}

	if (deleteButton) {
		deleteButton.addEventListener("click", async () => {
			if (confirm("Voulez-vous vraiment supprimer cette recette ?")) {
				try {
					const urlParams = new URLSearchParams(window.location.search)
					const recipeId = urlParams.get("id")
					await deletOneRecipe(recipeId)
					alert("Recette supprimée avec succès !")
					window.location.href = "index.html"
				} catch (error) {
					console.error("Erreur lors de la suppression:", error)
					alert("Erreur lors de la suppression de la recette.")
				}
			}
		})
	}
}

document.addEventListener("DOMContentLoaded", () => {
	// receive recipe id from url
	const urlParams = new URLSearchParams(window.location.search)
	const recipeId = urlParams.get("id")
	console.log("API recipeData:", recipeId)
	loadRecipe(recipeId)
	setupEventListeners()
})

// ============================================
// AFFICHER LES RECETTES DANS LA GRID
// ============================================
// Fonction fournie - génère le HTML pour toutes les recettes

const displaySingleRecipe = (recipe) => {
	// Récupérer le conteneur où afficher les recettes
	const recipesDetails = document.getElementById("recipe-detail")

	// Vider le conteneur avant d'ajouter les nouvelles recettes
	clearRecipesList(recipesDetails)

	// Si il n'y a pas de recette, afficher un message
	if (!recipe) {
		recipesDetails.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info text-center" role="alert">
                    Recette non-disponible. Veuillez revenir plus tard !
                </div>
            </div>
        `
		return
	}

	renderSingleRecipe(recipe)
}
