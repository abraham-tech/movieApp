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
    if (response.message === process.env.INVALID_CREDENTIALS) {
        response.status = process.env.BAD_REQUEST_STATUS_CODE;
        response.message = response.message;
    }
    res.status(response.status).json(response.message);
}



const _generateToken = (user) => {
    return new Promise((resolve, reject) => {
        jwt.sign({ username: user.username }, process.env.SECRTE_KEY, { expiresIn: process.env.TOKEN_EXPIRE_TIME }, (err, token) => {
            if (err) {
                reject(err);
            } else {
                user.token = token;
                resolve(user);
            }
        });
    });
};

const _findUser = (username) => {
    return User.findOne({ username }).exec();
};

const _comparePassword = (password, user) => {
    return new Promise((resolve, reject) => {
        if (user && bcrypt.compareSync(password, user.password)) {
            resolve(user);
        } else {
            reject(process.env.INVALID_CREDENTIALS);
        }
    });
};

const _createResponseWithToken = (user) => {
    return new Promise((resolve, reject) => {
        if (!user) {
            reject();
        } else {
            const userWithToken = {
                name: user.name,
                userName: user.username,
                token: user.token,
            };
            resolve(userWithToken);
        }
    })
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
    const { username, password } = req.body;
    const response = _createResponse(parseInt(process.env.OK_STATUS_CODE), {});

    _findUser(username)
        .then(user => _comparePassword(password, user))
        .then(user => _generateToken(user))
        .then(user => _createResponseWithToken(user))
        .then(userWithToken => _setResponse(response, userWithToken))
        .catch(error => _setErrorResponse(response, process.env.LOGIN_FAILED_STATUS_CODE, error))
        .finally(() => _sendResponse(res, response));
};

module.exports = {
    register,
    login
}