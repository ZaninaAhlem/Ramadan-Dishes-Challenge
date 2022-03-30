const app = require("../server");
const Dish = require("../models/dish");
const supertest = require("supertest");

test("GET /cooktime/:ingredient/:day", async () => {
  const dish = await Dish.create({
    name: "Veggie Couscous",
    ingredients: ["Semolina", "Potatoe", "Carrot", "Onion", "Tomato paste"],
    duration: 266,
  });

  await supertest(app)
    .get("/cooktime/:ingredient/:day")
    .expect(200)
    .then((response) => {
      // Check data
      expect(response.body[0].name).toBe(dish.name);
      expect(response.body[0].ingredients).toBe(dish.ingredients);
      expect(response.body[0].duration).toBe(dish.duration);
    });
});
