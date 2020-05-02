import {AuthenticationError} from "apollo-server-errors";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config';

const comparePassword = (password, hash) => new Promise(async (resolve, reject) => {
    try {
        const isMatch = await bcrypt.compare(password, hash);
        resolve(isMatch)
        return true;
    } catch (err) {
        reject(err)
        return false;
    }
})

const encrypt = password => new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            reject(err)
            return false;
        }
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
                reject(err)
                return false;
            }
            resolve(hash)
            return true;
        })
    })
})

const getToken = payload => {
    const token = jwt.sign({payload}, config.jwt, {
        expiresIn: 604800,
    })
    return token;
}

const getUser = async (req) => {
    const token = req.headers['token'];

    if (token) {
        try {
            return await jwt.verify(token, config.jwt);
        } catch (e) {
            throw new AuthenticationError('Your session expired. Sign in again.');
        }
    }
};

module.exports = {comparePassword, encrypt, getToken, getUser};