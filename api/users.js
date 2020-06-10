//Sean Spink
const router = require('express').Router();
const validation = require('../lib/validation');
const { generateAuthToken,
      requireAuthentication,
      requireAuthorizationURL} = require('../lib/auth');


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

router.get('/', requireAuthentication, async (req, res, next) => {
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

router.get('/:id', requireAuthentication, async (req, res, next) => {
  try {
    if(requireAuthorizationURL(req, res, next, 'id') == 1){
      const user = await getUserDetailsbyID(req.params.id);
      if (user) {
        res.status(200).send(user);
      } else {
        next();
      }
    } else {
      res.status(401).send({
        error: "User is not authorized to perform this action"
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to fetch user.  Please try again later."
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
          authenticated._id,
          authenticated.role);

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
       console.log("Body: ", req.body);
       console.log("Validation: ", validation.validateAgainstSchema(req.body, userSchema));
       if(validation.validateAgainstSchema(req.body, userSchema)){
        //Insert into mongoDB
        const id = await insertNewUser(req.body);
        if (id) {
          res.status(201).send({
              id: id,
              links: {
                  user: `/users/${id}`
              }
          });
        } else {
          res.status(400).send({
              error: "duplicate email or incorrect permission"
          });
        }
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

router.put('/:id', requireAuthentication,async (req, res, next) => {
   try{
      if(requireAuthorizationURL(req, res, next, 'id') == 1){  
         if(validation.validateAgainstSchema(req.body, userSchema)){
          //Insert into mongoDB
          const result = await updateUser(req.body, req.params.id);
          res.status(201).send({
              res: result,
              id: req.params.id,
              links: {
                  user: `/users/${req.params.id}`
              }
           });
         } else {
           res.status(400).send({
               error: "invalid body"
           });
         }
      } else {
        res.status(401).send({
          error: "User is not authorized to perform this action"
        });
      }
       
   } catch (err) {
       console.error(err);
       res.status(500).send({
           error: "internal error with creating user"
       });
   }
});

router.delete('/:id', requireAuthentication, async (req, res, next) => {
   try{
     if(requireAuthorizationURL(req, res, next, 'id') == 1){  
       var result = await deleteUser(req.params.id);
       res.status(201).send({status: "deleted", result: result});
     } else {
       res.status(401).send({
          error: "User is not authorized to perform this action"
        });
     }
   } catch (err){
       console.error(err);
       res.status(500).send({
           error: "internal error with creating user"
       });
   }
});


module.exports = router;
