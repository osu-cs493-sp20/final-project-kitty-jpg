//Sean Spink
const router = require('express').Router();
const validation = require('../lib/validation');

const {
  getUserDetailsbyID,    
  insertNewUser,
  deleteUser,
  updateUser,
  validateUser
} = require('../models/user');

const userSchema = {
    name: { required: true },
    email: { required: true },
    password: { required: true },
    role: { required: true }
}

router.get('/', async (req, res, next) => {
   try{
       //if authenticated
        //send user
       //else
        //send error
   } catch (err){
       console.error(err);
       res.status(500).send({
           error: "internal error with creating user"
       });
   }
});

router.get('/:id', async (req, res, next) => {
  try {
    const user = await getUserDetailsbyID(req.params.id);
    if (user) {
      res.status(200).send(user);
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to fetch business.  Please try again later."
    });
  }
});

/*
 * Route for user to get JWT 
 */
router.post('/login', async (req, res) => {
  if (req.body && req.body.email && req.body.password) {
    try {
      const authenticated = await validateUser(
        req.body.email,
        req.body.password
      );
      if (authenticated) {
        const token = generateAuthToken(
          authenticated.id,
          authenticated.admin);

        res.status(200).send({
          token: token
        });
      } else {
        res.status(401).send({
          error: "Invalid authentication credentials."
        })
      }
    } catch (err) {
      console.error("  -- error:", err);
      res.status(500).send({
        error: "Error logging in.  Try again later."
      });
    }
  } else {
    res.status(400).send({
      error: "Request body needs a user ID and password."
    });
  }
});

router.post('/', async (req, res, next) => {
   try {
       if(validation.validateAgainstSchema(req.body, userSchema)){
        //Insert into mongoDB
        const id = await insertNewUser(req.body);
        res.status(201).send({
            id: id,
            links: {
                user: `/users/${id}`
            }
         });
       } else {
         res.status(400).send({
             error: "invalid body"
         });
       }
       
   } catch (err) {
       console.error(err);
       res.status(500).send({
           error: "internal error with creating user"
       });
   }
});

router.put('/:id', async (req, res, next) => {
   try{
       if(validation.validateAgainstSchema(req.body, userSchema)){
        //Insert into mongoDB
        const id = await updateUser(req.body, req.params.id);
        res.status(201).send({
            id: id,
            links: {
                user: `/users/${id}`
            }
         });
       } else {
         res.status(400).send({
             error: "invalid body"
         });
       }
       
   } catch (err) {
       console.error(err);
       res.status(500).send({
           error: "internal error with creating user"
       });
   }
});

router.delete('/:id', async (req, res, next) => {
   try{
     var result = await deleteUser(req.params.id);
     res.status(201).send({status: "deleted", result: result});
   } catch (err){
       console.error(err);
       res.status(500).send({
           error: "internal error with creating user"
       });
   }
});


module.exports = router;
