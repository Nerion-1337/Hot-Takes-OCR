const password = require("password-validator");

const passSchema = new password();

passSchema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase(2)                              // Minimum de majuscule contenu
.has().lowercase(2)                              // Minimum de minuscule contenu
.has().digits(2)                                // Minimum de nombre contenu
.has().not().spaces()                           // Pas d'espace
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist

// permet de controler simplement le contenu d'un document
// node middleware/password.js
//console.log( passSchema);


module.exports = (req, res, next) => {
       if(passSchema.validate(req.body.password)){
        next();
       }else{
        return res.status(400).json({error: `Mot de passe trop faible: ${passSchema.validate('req.body.password', { list: true })}`})
       }
    };