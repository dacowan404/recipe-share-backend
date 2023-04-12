const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const Recipe = require('../models/recipe');

const secretKey = process.env.SECRET_KEY;

function verifyToken(req, res, next) {
  //get auth header value
  const bearerHeader = req.headers['authorization'];
  // check if bearer if undefined
  if (typeof bearerHeader !== 'undefined') {
    // get bearer from header
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  }
  else {
    // Forbidden
    res.status(403).json({mess: 'invalid access token'});
  }
}

router.route('/explore').get((req, res) => {
  Recipe.find({})
  .sort({likes: -1})
  .then(recipes => res.json(recipes))
  .catch(err => res.status(400).json('Error routes/index.js ' + err))
});

// recipe routes
router.get('/myrecipes', verifyToken, (req, res) => {
  jwt.verify(req.token, secretKey, (err,  authData) => {
    if (err) {
      console.log(err)
      res.status(403).json({message: '44'})
    } else {
      Recipe.find({"creator.id": authData.userInfo.id})
      .sort({likes:-1})
      .then(recipes => res.status(200).json(recipes))
      .catch(err => res.status(400).json('Error 49' + err))
    }
  })
})

router.post('/createRecipe', verifyToken, (req, res) => {
  jwt.verify(req.token, secretKey, (err, authData) => {
    if (err) {
      console.log(err)
      res.status(403).json({message: '44'})
    } else {
    const newRecipe = new Recipe({   
      name: req.body.name,
      ingredients: req.body.ingredients,
      steps: req.body.steps,
      description: req.body.description,
      notes: req.body.notes,
      creator: {
        id: authData.userInfo.id, 
        name: authData.userInfo.username
      },
      editedDate: req.body.editedDate
    })

  newRecipe.save().then((result)=> {
    res.status(200).json(result.id)
  })
    .catch(err => res.status(400).json('Error routes.index.js ' + err));
}});
})

// delete recipe
router.delete('/recipe/:id', verifyToken, (req, res, next) => {
  async function recipe(callback) {
    await Recipe.findById(req.params.id).exec(callback);
  }
  recipe(
    (err, results) => {
      if  (err) {
        return next(err);
      }
      if (results == null) {
        res.status(204).json('No results found');
      }
      jwt.verify(req.token, secretKey, (err, authData) => {
        if (err) {
          console.log(err);
          res.status(403).json({message: 106})
        } else if (results.creator.id == authData.userInfo.id){
          Recipe.findByIdAndRemove(req.params.id, (err) => {        
            if (err) {          
              return next(err);        
            }        
            res.status(200).json("successfully deleted");      
          })
        } else {
          res.status(403).json("Unable to delete recipe, incorrect user");
        }
      })
    }
  )
})

// update recipe
router.put('/recipe/:id', verifyToken, (req, res, next) => {
  async function recipe(callback) {
    await Recipe.findById(req.params.id).exec(callback);
  }
  recipe((err, results) => {
    if (err) {
      return next(err);
    }
    if (results == null) {
      res.status(204).json('No results found');
    }
    jwt.verify(req.token, secretKey, (err, authData) => {
      if (err) {
        console.log(err);
        res.status(403).json({message: 137})
      } else if (results.creator.id == authData.userInfo.id) {
        Recipe.findByIdAndUpdate(req.params.id, {
          name: req.body.name,
          ingredients: req.body.ingredients,
          steps: req.body.steps,
          description: req.body.description,
          notes: req.body.notes,
          editedDate: req.body.editedDate
        }, (err, results) => {
          if (err)  {
            console.log(err);
            res.status(400).json({message: 149})
          } else {
            res.status(200).json(req.params.id)
          }
        })
      } else {
        console.log(res.data.creator, req.body.creatorID);
        res.status(403).json('incorrect user logged in');
      }
    })
  })
})

// view a recipe
router.route('/recipe/:id').get((req, res) => {
  Recipe.findById(req.params.id)
    .exec((err, recipe) => {
      if (err) {
        return err;
      }
      if (recipe == null) {
        const err = new Error("Recipe not found");
        err.status = 404;
        return err;
      }
      //console.log(recipe)
      res.json(recipe);
    });
});

module.exports = router;
