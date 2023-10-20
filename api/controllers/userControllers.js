const User = require("../data/schemas/usersModel")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const _setErrorResponse = (response, status, error) => {
    response.status = status;
    response.message = error;
}

const _createUser = (newUser) => {
    return User.create(newUser);
}

const _createResponse = (status, message) => {
    return { "status": status, "message": message };
}

const _createNewUser = (username, name, password = "") => {
    return { "username": username, "name": name, "password": password };
}

const _setResponse = (response, savedUser) => {
    console.log("responst ", response, "message ", savedUser);
    response.message = savedUser;
}

const _generateSalt = () => {
    return bcrypt.genSalt(parseInt(process.env.SALT_GENERATION_COST));
}

const _generateHash = (password, salt) => {
    return bcrypt.hash(password, salt)
}

const _setPassword = (newUser, password) => {
    return new Promise((resolve, reject) => {
        if (!password) {
            reject();
        } else {
            newUser.password = password;
            resolve();
        }
    })
}

const _sendResponse = (res, response) => {
    console.log("response: r", response,);
    res.status(response.status).json(response.message);
}

const register = (req, res) => {
    const response = _createResponse(process.env.CREATED_STATUS_CODE, {});
    const newUser = _createNewUser(req.body.username, req.body.name);

    _generateSalt()
        .then(salt => _generateHash(req.body.password, salt))
        .then(hashedPassword => _setPassword(newUser, hashedPassword))
        .then(() => _createUser(newUser))
        .then(savedUser => _setResponse(response, savedUser))
        .catch(error => _setErrorResponse(response, process.env.INTERNAL_SERVER_ERROR, error))
        .finally(() => _sendResponse(res, response))
}


const login = (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    const response = { status: 0, message: {} };

    User.findOne({ username: username }).exec().then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
            let token = jwt.sign({ username: user.name }, process.env.SECRTE_KEY, { expiresIn: 3600 });
            const response = {
                name: user.name,
                userName: user.username,
                token: token
            };
            res.status(200).json(response);

        } else {
            res.status(process.env.LOGIN_FAILD_STATUS_CODE).json({
                [process.env.MESSAGE]: process.env.LOGIN_FAILD
            });
        }

    }).catch(err => {
        console.log(err);
        res.status(process.env.LOGIN_FAILD_STATUS_CODE).json({
            [process.env.MESSAGE]: process.env.LOGIN_FAILD
        });
    })
}


module.exports = {
    register,
    login
}