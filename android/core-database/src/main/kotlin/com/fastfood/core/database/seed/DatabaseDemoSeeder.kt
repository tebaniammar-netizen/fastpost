package com.fastfood.core.database.seed

import com.fastfood.core.database.FastFoodDatabase
import com.fastfood.core.database.entity.*
import com.fastfood.core.model.stock.StockUnit
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

object DatabaseDemoSeeder {

    suspend fun seedDatabaseIfEmpty(database: FastFoodDatabase) = withContext(Dispatchers.IO) {
        val categoryDao = database.categoryDao()
        val productDao = database.productDao()
        val ingredientDao = database.ingredientDao()

        // Si des catégories existent déjà, on ne réinsère pas
        // Catégories
        val catBurgers = CategoryEntity(id = "cat-burgers", nom = "Burgers Gourmets", icone = "burger", ordreAffichage = 1)
        val catMenus = CategoryEntity(id = "cat-menus", nom = "Menus Fast & Tasty", icone = "menu", ordreAffichage = 2)
        val catSides = CategoryEntity(id = "cat-sides", nom = "Accompagnements", icone = "fries", ordreAffichage = 3)
        val catDrinks = CategoryEntity(id = "cat-drinks", nom = "Boissons Fraîches", icone = "drink", ordreAffichage = 4)
        val catDesserts = CategoryEntity(id = "cat-desserts", nom = "Desserts & Glaces", icone = "icecream", ordreAffichage = 5)

        categoryDao.insertCategories(listOf(catBurgers, catMenus, catSides, catDrinks, catDesserts))

        // Ingrédients
        val ingBun = IngredientEntity(id = "ing-bun", nom = "Pain Brioché Sésame", unite = StockUnit.PIECE, stockActuel = 120.0, seuilAlerte = 25.0, coutUnitaireCentimes = 35)
        val ingSteak = IngredientEntity(id = "ing-steak", nom = "Steak Pur Bœuf 150g", unite = StockUnit.PIECE, stockActuel = 90.0, seuilAlerte = 20.0, coutUnitaireCentimes = 140)
        val ingCheddar = IngredientEntity(id = "ing-cheddar", nom = "Cheddar Affiné", unite = StockUnit.PIECE, stockActuel = 240.0, seuilAlerte = 40.0, coutUnitaireCentimes = 25)
        val ingBacon = IngredientEntity(id = "ing-bacon", nom = "Bacon Fumé Grillé", unite = StockUnit.PIECE, stockActuel = 180.0, seuilAlerte = 35.0, coutUnitaireCentimes = 30)
        val ingSauceBbq = IngredientEntity(id = "ing-sauce-bbq", nom = "Sauce Barbecue Fumée", unite = StockUnit.MILLILITRE, stockActuel = 4000.0, seuilAlerte = 800.0, coutUnitaireCentimes = 1)
        val ingFries = IngredientEntity(id = "ing-fries", nom = "Pommes de Terre Frites", unite = StockUnit.GRAMME, stockActuel = 20000.0, seuilAlerte = 4000.0, coutUnitaireCentimes = 2)

        ingredientDao.insertIngredients(listOf(ingBun, ingSteak, ingCheddar, ingBacon, ingSauceBbq, ingFries))

        // Produits
        val prodDoubleSmash = ProductEntity(
            id = "prod-smash",
            categorieId = catBurgers.id,
            nom = "Double Smash Bacon Burger",
            description = "Deux steaks smashés croustillants, double cheddar affiné, bacon fumé, sauce BBQ.",
            prixBaseCentimes = 990, // 9.90 €
            tvaTauxBp = 1000
        )

        val prodMaxiMenu = ProductEntity(
            id = "prod-menu-maxi",
            categorieId = catMenus.id,
            nom = "Menu Maxi Smash + Frites + Boisson",
            description = "Le burger phare avec grande portion de frites et boisson 50cl.",
            prixBaseCentimes = 1450, // 14.50 €
            tvaTauxBp = 1000
        )

        val prodFrites = ProductEntity(
            id = "prod-frites",
            categorieId = catSides.id,
            nom = "Frites Maison Rustiques",
            description = "Pommes de terre coupées épaisses avec peau, frites en 2 bains.",
            prixBaseCentimes = 380, // 3.80 €
            tvaTauxBp = 1000
        )

        productDao.insertProducts(listOf(prodDoubleSmash, prodMaxiMenu, prodFrites))

        // Variantes
        val varSimple = ProductVariantEntity(id = "var-1", produitId = prodDoubleSmash.id, nom = "Double Steak Standard", prixDifferentielCentimes = 0, ordre = 1)
        val varTriple = ProductVariantEntity(id = "var-2", produitId = prodDoubleSmash.id, nom = "Triple Viande XL", prixDifferentielCentimes = 260, ordre = 2)
        productDao.insertVariants(listOf(varSimple, varTriple))

        // Extras
        val extraCheddar = ProductExtraEntity(id = "ext-cheddar", nom = "Extra Cheddar", prixCentimes = 120, ingredientId = ingCheddar.id)
        val extraBacon = ProductExtraEntity(id = "ext-bacon", nom = "Extra Double Bacon", prixCentimes = 180, ingredientId = ingBacon.id)
        productDao.insertExtras(listOf(extraCheddar, extraBacon))

        // Recettes (Nomenclature pour déstockage automatique)
        val rec1 = RecipeLineEntity(id = "rec-1", produitId = prodDoubleSmash.id, ingredientId = ingBun.id, quantiteRequise = 1.0)
        val rec2 = RecipeLineEntity(id = "rec-2", produitId = prodDoubleSmash.id, ingredientId = ingSteak.id, quantiteRequise = 2.0)
        val rec3 = RecipeLineEntity(id = "rec-3", produitId = prodDoubleSmash.id, ingredientId = ingCheddar.id, quantiteRequise = 2.0)
        val rec4 = RecipeLineEntity(id = "rec-4", produitId = prodDoubleSmash.id, ingredientId = ingBacon.id, quantiteRequise = 2.0)
        val rec5 = RecipeLineEntity(id = "rec-5", produitId = prodDoubleSmash.id, ingredientId = ingSauceBbq.id, quantiteRequise = 30.0)

        val recFrites = RecipeLineEntity(id = "rec-frites", produitId = prodFrites.id, ingredientId = ingFries.id, quantiteRequise = 200.0)

        ingredientDao.insertRecipeLines(listOf(rec1, rec2, rec3, rec4, rec5, recFrites))
    }
}
