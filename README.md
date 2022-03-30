# Ramadan-Dishes-Challenge

Hey There 👏

Hope you’re having a super day! ☀️

In this project I've created two endpoints.
The first one will give you a list of dishes, its name, ingredients and when should the user start cooking,
depends on the ingredient and Ramathan day the user give.

### First Endpoint
```
http://localhost:3000/cooktime/Salt/01
```
### Result For First Endpoint Example
```
"resultDishes": [
        {
            "ingredients": [
                "Potatoe",
                "Salt"
            ],
            "_id": "624436d0327cdb0db81da59b",
            "name": "French Fries",
            "duration": "30",
            "__v": 0,
            "cookTime": "120 minutes after Asr"
        }
    ]
```

The second one will suggest you a dishe, its name, ingredients and when should the user start cooking,
depends on Ramathan day the user give.
### Second Endpoint
```
http://localhost:3000/suggest/01
```
### Result For First Endpoint Example
```
"dish": {
        "ingredients": [
            "Semolina",
            "Potatoe",
            "Carrot",
            "Onion",
            "Tomato paste"
        ],
        "_id": "624436d0327cdb0db81da592",
        "name": "Veggie Couscous",
        "duration": "266",
        "__v": 0,
        "cookTime": "116 minutes before Asr"
    }
```

### Project setup
```
npm install
```

### Run Project
```
npm run dev
```
