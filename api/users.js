const router = require('express').Router();
const validation = require('../lib/validation');

const userSchema = {
    name: { required: true },
    email: { required: true },
    password: { required: true },
    role: { required: true },
}

router.post('/', async (req, res, next) => {
   try {
       console.log(req.body);
       if(validation.validateAgainstSchema(req.body, userSchema)){
         res.status(200).send({
            body: req.body
         });  
       } else {
         res.status(400).send({
             error: "invalid body"
         })
       }
       
   } catch (err) {
       console.error(err);
       res.status(500).send({
           error: "internal error with creating user"
       });
   }
});


module.exports = router;
