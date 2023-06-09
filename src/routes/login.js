const { User } = require('../db/sequelize');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const privateKey = require('../auth/private_key');

module.exports = (app) => {
  app.post('/api/login', (req, res) => {
    User.findOne({ where: { username: req.body.username } }).then(user => {

        if(!user){
            const message = `L'utilisateur ou le mot de passe est incorrect.`;
            return res.status(404).json({message});
        }
        bcryptjs.compare(req.body.password, user.password).then(isPasswordValid => {
        if(!isPasswordValid) {
          const message = `L'utilisateur ou le mot de passe est incorrect.`;
          return res.status(401).json({ message})
        }

        // JWT
        const token = jwt.sign(
            {userId: user.id},
            privateKey,
            {expiresIn: '24h'}
        );

        const message = `L'utilisateur a été connecté avec succès.`;
        return res.json({ message, data: user, token })
      })
    })
    .catch(error => {
        const message = `L'utilisateur n'a pas pu être connecté. Réessayez dans quleques instants.`;
        return res.json({ message, data: error })
    })
  })
}