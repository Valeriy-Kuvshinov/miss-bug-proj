import fs from 'fs'
import Cryptr from 'cryptr'
import dotenv from 'dotenv'
import { utilService } from "./utils.service.js"

dotenv.config()
console.log(process.env.DECRYPTION)

const cryptr = new Cryptr(process.env.DECRYPTION || 'Secret-1234')
const users = utilService.readJsonFile('data/user.json')

export const userService = {
    add,            // Create (Signup)
    remove,
    getById,        // Read (Profile page)
    query,          // List (of users)
    getLoginToken,
    validateToken,
    checkLogin
}

function checkLogin({ username, password }) {
    var user = users.find(u => u.username === username && u.password === password)
    if (user) {
        // mini-user:
        user = {
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            isAdmin: user.isAdmin
        }
    }
    if (!user) return Promise.reject("Invalid username or password")
    return Promise.resolve(user)
}

function getLoginToken(user) {
    return cryptr.encrypt(JSON.stringify(user))
}

function validateToken(loginToken) {
    if (!loginToken) return null
    const json = cryptr.decrypt(loginToken)
    const loggedinUser = JSON.parse(json)
    return loggedinUser
}

function query() {
    const res = users.map(user => {
        user = { ...user }
        delete user.password
        return user
    })
    return Promise.resolve(res)
}

function getById(userId) {
    var user = users.find(user => user._id === userId)
    if (user) {
        user = {
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            isAdmin: user.isAdmin
        }
    }
    return Promise.resolve(user)
}

function add({ fullname, username, password }) {
    const user = {
        _id: utilService.makeId(),
        fullname,
        username,
        password,
    }
    users.push(user)
    return _saveUsersToFile().then(() => ({ _id: user._id, fullname: user.fullname }))
}

function remove(userId, loggedinUser) {
    const idx = users.findIndex(user => user._id === userId)
    if (idx === -1) return Promise.reject('No such user!')
    users.splice(idx, 1)
    return _saveUsersToFile()
}

function _saveUsersToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(users, null, 2)
        fs.writeFile('data/user.json', data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}