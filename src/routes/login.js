const { User } = require('../db/sequelize')
const bcryptjs = require('bcryptjs')
  
module.exports = (app) => {
  app.post('/api/login', (req, res) => {
  
    User.findOne({ where: { username: req.body.username } }).then(user => {
        bcryptjs.compare(req.body.password, user.password).then(isPasswordValid => {
        if(isPasswordValid) {
          const message = `L'utilisateur a été connecté avec succès`;
          return res.json({ message, data: user })
        }
      })
    })
  })
}