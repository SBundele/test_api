const express = require("express");
const { resolve } = require("path");
let cors = require("cors");
let sqlite3 = require("sqlite3").verbose();
let { open } = require("sqlite");

const app = express();
const port = 3000;
app.use(cors());

app.use(express.static("static"));

let db;

(async () => {
  db = await open({
    filename: "./database.sqlite",
    driver: sqlite3.Database,
  });
})();

//Exercise 1: Get All Restaurants
async function fetchAllRestaurants() {
  let query = "SELECT * FROM restaurants";
  let response = await db.all(query, []);

  return { restaurants: response };
}
app.get("/restaurants", async (req, res) => {
  try {
    let results = await fetchAllRestaurants();
    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: "No Restaurants found." });
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Exercise 2: Get Restaurant by ID
async function fetchRestaurantsById(id) {
  let query = "SELECT * FROM restaurants WHERE id = ?";
  let response = await db.all(query, [id]);

  return { restaurants: response };
}
app.get("/restaurants/details/:id", async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    let results = await fetchRestaurantsById(id);
    if (results.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: "No Restaurants found with given id: " + id });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//Exercise 3: Get Restaurants by Cuisine
async function fetchRestaurantsByCuisine(cuisine) {
  let query = "SELECT * FROM restaurants WHERE cuisine = ?";
  let response = await db.all(query, [cuisine]);

  return { restaurants: response };
}

app.get("/restaurants/cuisine/:cuisine", async (req, res) => {
  let cuisine = req.params.cuisine;
  try {
    let results = await fetchRestaurantsByCuisine(cuisine);
    if (results.restaurants.length === 0) {
      return res.status(404).json({
        message: "No Restaurants found with given cuisine: " + cuisine,
      });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//Exercise 4: Get Restaurants by Filter
async function fetchRestaurantsByFilters(isVeg, hasOutdoorSeating, isLuxury) {
  let query =
    "SELECT * FROM restaurants WHERE isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ?";
  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);

  return { restaurants: response };
}
app.get("/restaurants/filter", async (req, res) => {
  let isVeg = req.query.isVeg;
  let hasOutdoorSeating = req.query.hasOutdoorSeating;
  let isLuxury = req.query.isLuxury;
  try {
    let results = await fetchRestaurantsByFilters(
      isVeg,
      hasOutdoorSeating,
      isLuxury
    );
    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: "No Restaurants found." });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//Exercise 5: Get Restaurants Sorted by Rating
async function fetchRestaurantsSortedByRating() {
  let query = "SELECT * FROM restaurants ORDER BY rating DESC";
  let response = await db.all(query, []);

  return { restaurants: response };
}
app.get("/restaurants/sort-by-rating", async (req, res) => {
  try {
    let results = await fetchRestaurantsSortedByRating();
    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: "No Restaurants found." });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//Exercise 6: Get All Dishes

async function fetchAllDishes() {
  let query = "SELECT * FROM dishes";
  let response = await db.all(query, []);

  return { dishes: response };
}

app.get("/dishes", async (req, res) => {
  try {
    let results = await fetchAllDishes();
    if (results.dishes.length === 0) {
      return res.status(404).json({ message: "No dishes found." });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//Exercise 7: Get Dish by ID
async function fetchDishesById(id) {
  let query = "SELECT * FROM dishes WHERE id = ?";
  let response = await db.all(query, [id]);

  return { dishes: response };
}
app.get("/dishes/details/:id", async (req, res) => {
  let id = req.params.id;
  try {
    let results = await fetchDishesById(id);
    if (results.dishes.length === 0) {
      return res
        .status(404)
        .json({ message: "No Dishes found with given id: " + id });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//Exercise 8: Get Dishes by Filter
async function fetchDishesByFilter(isVeg) {
  let query = "SELECT * FROM dishes WHERE isVeg = ?";
  let response = await db.all(query, [isVeg]);

  return { dishes: response };
}
app.get("/dishes/filter", async (req, res) => {
  let isVeg = req.query.isVeg;
  try {
    let results = await fetchDishesByFilter(isVeg);
    if (results.dishes.length === 0) {
      return res.status(404).json({ message: "No Dishes found." });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//Exercise 9: Get Dishes Sorted by Price
async function fetchDishesSortedByPrice() {
  let query = "SELECT * FROM dishes ORDER BY price";
  let response = await db.all(query, []);

  return { dishes: response };
}
app.get("/dishes/sort-by-price", async (req, res) => {
  try {
    let results = await fetchDishesSortedByPrice();
    if (results.dishes.length === 0) {
      return res.status(404).json({ message: "No Dishes found." });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
