const express = require("express");
const router = new express.Router();
const Dish = require("../models/dish");
const fetch = require("node-fetch");
const geoip = require("geoip-lite");

/*const insertData = async() => {
  try{
    await Dish.insertMany(
      [
        {
          "name": "Meshwiya Salad",
          "ingredients": [
            "Pepper",
            "Tomatoe",
            "Garlic",
            "Onion"
          ],
          "duration": 30
        },
        {
          "name": "Veggie Couscous",
          "ingredients": [
            "Semolina",
            "Potatoe",
            "Carrot",
            "Onion",
            "Tomato paste"
          ],
          "duration": 266 
        },
        {
          "name": "Ummak Huriya",
          "ingredients": [
            "Carrot",
            "Garlic",
            "Harissa",
            "Onion"
          ],
          "duration": 15 
        },
        {
          "name": "Jerbian Rice",
          "ingredients": [
            "Carrot",
            "Rice",
            "Potatoe",
            "Onion",
            "Tomatoe"
          ],
          "duration": 300 
        },
        {
          "name": "Shakshouka",
          "ingredients": [
            "Egg",
            "Harissa",
            "Tomatoe Paste"
          ],
          "duration": 40 
        },
        {
          "name": "Tabouleh",
          "ingredients": [
            "Bulgur",
            "Parsley",
            "Onion",
            "Tomatoe"
          ],
          "duration": 70
        },
        {
          "name": "Soup",
          "ingredients": [
            "Bird Tongue",
            "Garlic",
            "Onion",
            "Tomatoe Paste"
          ],
          "duration": 40
        },
        {
          "name": "Brik",
          "ingredients": [
            "Malsouqa",
            "Egg",
            "Tuna"
          ],
          "duration": 25 
        },
        {
          "name": "Spaghetti",
          "ingredients": [
            "Spaghetti",
            "Tomatoe Paste",
            "Chicken"
          ],
          "duration": 300
        },
        {
          "name": "BBQ",
          "ingredients": [
            "Meat",
            "Harissa",
            "Black Pepper",
            "Garlic"
          ],
          "duration": 180
        },
        {
          "name": "French Fries",
          "ingredients": [
            "Potatoe",
            "Salt"
          ],
          "duration": 30
        },
        {
          "name": "Stuffed Peppers",
          "ingredients": [
            "Pepper",
            "Garlic",
            "Onion",
            "Parsley",
            "Chicken",
            "Tomatoe Paste"
          ],
          "duration": 274
        },
        {
          "name": "Kabsa",
          "ingredients": [
            "Chicken",
            "Garlic",
            "Pepper",
            "Curcuma",
            "Cinnamon",
            "Rice"
          ],
          "duration": 180
        },
        {
          "name": "Cannelloni",
          "ingredients": [
            "Chicken",
            "Cannelloni",
            "Onion",
            "Tomatoe Paste"
          ],
          "duration": 150
        },
        {
          "name": "Blunkett Salad",
          "ingredients": [
            "Bread",
            "Horseradish",
            "Egg",
            "Tuna"
          ],
          "duration": 30
        },
        {
          "name": "Tajeen",
          "ingredients": [
            "Egg",
            "Chicken",
            "Parsley",
            "Onion"
          ],
          "duration": 43
        },
        {
          "name": "Kamuniya",
          "ingredients": [
            "Meat",
            "Cumin",
            "Tomatoe Paste"
          ],
          "duration": 88 
        },
        {
          "name": "Tunisian Salad",
          "ingredients": [
            "Tomatoe",
            "Onion",
            "Cucumber"
          ],
          "duration": 19 
        },
        {
          "name": "Merguaz",
          "ingredients": [
            "Merguaz"
          ],
          "duration": 32
        },
        {
          "name": "Masfoof",
          "ingredients": [
            "Semolina",
            "Milk",
            "Sugar",
            "Raisin"
          ],
          "duration": 70
        },
        {
          "name": "Dweeda",
          "ingredients": [
            "Dweeda",
            "Tomatoe Paste",
            "Meat",
            "Potatoe",
            "Carrot",
            "Onion"
          ],
          "duration": 310
        },
        {
          "name": "Mermez",
          "ingredients": [
            "Chickpea",
            "Tomatoe Paste",
            "Meat",
            "Onion"
          ],
          "duration": 110
        },
        {
          "name": "Roast Chicken",
          "ingredients": [
            "Chicken",
            "Garlic",
            "Onion",
            "Oil"
          ],
          "duration": 193
        }
      ]
    )
  }catch(error){
    console.log(error);
  }
}*/

const isDayValid = (day) => {
  return day > 0 && day < 31 && day.length == 2;
};

const getPrayerTimings = async (day) => {
  var ip = "193.95.44.241";
  var geo = geoip.lookup(ip);
  var hijriYear = new Date().getFullYear() - 579;

  const apiResponse = await fetch(
    `http://api.aladhan.com/v1/hijriCalendar?latitude=${geo.ll[0]}&longitude=${geo.ll[1]}&method=2&month=9&year=${hijriYear}`
  );
  const apiResponseJson = await apiResponse.json();

  const dayData = apiResponseJson.data.filter(
    (data) => data.date.hijri.day == day
  );

  return dayData[0].timings;
};

const getCookingTime = (timings, dishDuration) => {
  var asrTime = new Date("2022-01-01 " + timings.Asr).getTime();
  var maghribTime = new Date("2022-01-01 " + timings.Maghrib).getTime();
  var differenceTime = (maghribTime - asrTime) / 60000;

  return differenceTime - dishDuration - 15;
};

const throwError = (error) => {
  const someError = { error };
  Error.captureStackTrace(someError);
  throw someError;
};

router.get("/cooktime/:ingredient/:day", async (req, res) => {
  try {
    !isDayValid(req.params.day)
      ? throwError("Please set a valid day between 01 and 30")
      : {};
    !req.params ? throwError("Please enter an ingredient and a day!") : {};

    //get dishes with the passed ingredient
    resultDishes = await Dish.find({ ingredients: req.params.ingredient });
    resultDishes.length == 0
      ? throwError(
          `No dishes found with the given ingredient. Please try with an other one.`
        )
      : {};

    const prayerTimings = await getPrayerTimings(req.params.day);

    resultDishes.map((dish) => {
      var cookingTime = getCookingTime(prayerTimings, Number(dish.duration));
      cookingTime < 0
        ? (dish.cookTime = `${-cookingTime} minutes before Asr`)
        : (dish.cookTime = `${cookingTime} minutes after Asr`);
    });

    res.status(200).send({ resultDishes });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.get("/suggest/:day", async (req, res) => {
  try {
    !isDayValid(req.params.day)
      ? throwError("Please set a valid day between 01 and 30")
      : {};

    //get all dishes
    const dishes = await Dish.find();
    //get a random number between 0 and the size of the list
    const randomNum = Math.floor(Math.random() * dishes.length + 1);

    const prayerTimings = await getPrayerTimings(req.params.day);
    var dish = dishes[randomNum];

    var cookingTime = getCookingTime(prayerTimings, Number(dish.duration));

    cookingTime < 0
      ? (dish.cookTime = `${-cookingTime} minutes before Asr`)
      : (dish.cookTime = `${cookingTime} minutes after Asr`);

    res.status(200).send({ dish });
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

//A route to handle 404 errors
router.get("*", function (req, res) {
  res.status(404).send("Please set a valid value for ingredient and day");
});

//insertData()
module.exports = router;
