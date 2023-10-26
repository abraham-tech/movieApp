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
    } else if (response)
        res.status(response.status).json(response.message);
}



const _generateToken = (user) => {
    return new Promise((resolve, reject) => {
        jwt.sign({ username: user.username }, process.env.SECRTE_KEY, { expiresIn: process.env.TOKEN_EXPIRE_TIME }, (err, token) => {
            if (err) {
                reject(err);
            } else {
                resolve(token);
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

const _createResponseWithToken = (token) => {
    return new Promise((resolve, reject) => {
        if (!token) {
            reject();
        } else {
            resolve({ "token": token });
        }
    })
}

const _checkIfUserFound = (user) => {
    return new Promise((resolve, reject) => {
        if (!user) {
            reject();
        } else {
            resolve(user);
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
        .catch(error => _setErrorResponse(response, process.env.REGISTRATION_FAILED_STATUS_CODE, error))
        .finally(() => _sendResponse(res, response))
}


const login = (req, res) => {
    const { username, password } = req.body;
    const response = _createResponse(parseInt(process.env.OK_STATUS_CODE), {});

    _findUser(username)
        .then(user => _checkIfUserFound(user))
        .then(user => _comparePassword(password, user))
        .catch(error => _setErrorResponse(response, process.env.LOGIN_FAILED_STATUS_CODE, error))
        .then(user => _generateToken(user))
        .then(token => _createResponseWithToken(token))
        .then(message => _setResponse(response, message))
        .catch(error => _setErrorResponse(response, process.env.LOGIN_FAILED_STATUS_CODE, error))
        .finally(() => _sendResponse(res, response));
};

module.exports = {
    register,
    login
}