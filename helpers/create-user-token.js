const jwt = require('jsonwebtoken');
require('dotenv').config()

const createUserToken = async (user, req, res) => {

    const token = jwt.sign({
        name: user.name,
        id: user.id
    }, process.env.JWT_SECRET)



}

module.exports = createUserToken