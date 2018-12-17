const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Recipe = require('./models/recipe');
const app = express();

mongoose.connect('mongodb+srv://tester:saNmrfukI9ZOQDlm@andela-1dp2d.mongodb.net/test?retryWrites=true')
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas!');
    })
    .catch((error) => {
        console.log('Unable to connect to MongoDB Atlas!');

        console.error(error);
    });

// This will allow all requests from all origins to access your API
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// set json function as global middleware
app.use(bodyParser.json())

// POST route to add a new item
app.post('/api/recipes', (req, res, next) => {
    // console.log(req.body)
    const recipe = new Recipe({
        title: req.body.title,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        difficulty: req.body.difficulty,
        time: req.body.time,
    });

    recipe.save().then( () => {
        res.status(201).json({
            message: 'Post saved successfully!'
        });
    }).catch( (error) => {
        res.status(400).json({
            error: error
        });
    });
})

// GET route to return a specific item
app.get('/api/recipes/:id', (req, res, next) => {
    Recipe.findOne({_id: req.params.id}).then( (recipe) => {
        res.status(200).json(recipe);
    }).catch( (error) => {
        res.status(404).json({
            error: error
        });
    });
});

// PUT route to edit a specific item
app.put('/api/recipes/:id', (req, res, next) => {

    const recipe = new Recipe({
        _id: req.params.id,
        title: req.body.title,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        difficulty: req.body.difficulty,
        time: req.body.time,
    });

    Recipe.updateOne({_id: req.params.id}, recipe).then( () => {
        res.status(201).json({
            message: 'Recipe updated successfully!'
        });
    }).catch( (error) => {
        res.status(400).json({
            error: error
        });
    });
});

// DELETE route to delete a specific item
app.delete('/api/recipes/:id', (req, res, next) => {
    Recipe.deleteOne({_id: req.params.id}).then( () => {
        res.status(200).json({
            message: "Deleted!"
        });
    }).catch( (error) => {
        res.status(400).json({
            error: error
        });
    });
});

// GET route to return all items
app.get('/api/recipes', (req, res, next) => {
    Recipe.find().then( (recipes) => {
        res.status(200).json(recipes);
    }).catch( (error) => {
        res.status(400).json({
            error: error
        });
    });
});

module.exports = app