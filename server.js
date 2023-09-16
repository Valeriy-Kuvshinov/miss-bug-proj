import express from 'express'
import cookieParser from 'cookie-parser'
import path from 'path'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'
import { userService } from './services/user.service.js'

const app = express()

// Express Config:
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// Express Routing:
app.get('/', (req, res) => {
    res.send('<h1>Hello and welcome to my server!</h1>')
})

// Check the user logged in
function requireAuth(req, res, next) {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Authentication required / Incorrect authentication Token')
    req.loggedinUser = loggedinUser
    console.log('User: ', loggedinUser)
    console.log('Token: ', req.cookies.loginToken)
    next()
}

// Get bugs (READ)
app.get('/api/bug', (req, res) => {
    console.log('req.query', req.query)
    const filterBy = {
        title: req.query.title || '',
        minSeverity: req.query.minSeverity ? +req.query.minSeverity : 0,
        labels: req.query.label || '',
        sortBy: req.query.sortBy || '',
        sortDir: req.query.sortDir || '',
        pageIdx: req.query.pageIdx ? +req.query.pageIdx : undefined,
        ownerId: req.query.ownerId || ''
    }
    bugService.query(filterBy)
        .then(bugs => {
            res.send(bugs)
        })
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(400).send(`Cannot get bugs: ${err.message}`)
        })
})

// Add bug 
app.post('/api/bug', requireAuth, (req, res) => {
    console.log('req.body:', req.body)
    const bug = {
        title: req.body.title,
        description: req.body.description,
        severity: req.body.severity,
        createdAt: req.body.createdAt || Date.now(),
        labels: Array.isArray(req.body.labels) ? req.body.labels : req.body.labels.split(", ").map(label => label.trim()),
        owner: req.body.owner
    }
    bugService.save(bug, req.loggedinUser)
        .then(bug => {
            res.send(bug)
        })
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send(`Cannot save bug: ${err.message}`)
        })
})

// Update bug
app.put('/api/bug', requireAuth, (req, res) => {
    console.log('req.body:', req.body)
    const bug = {
        _id: req.body._id,
        title: req.body.title,
        description: req.body.description,
        severity: req.body.severity,
        createdAt: req.body.createdAt,
        labels: req.body.labels,
        owner: req.body.owner
    }
    bugService.save(bug, req.loggedinUser)
        .then(bug => {
            res.send(bug)
        })
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send(`Cannot save bug ${err.message}`)
        })
})

// Get bug (READ)
app.get('/api/bug/:bugId', requireAuth, (req, res) => {
    const { bugId } = req.params
    bugService.getById(bugId)
        .then(bug => {
            res.send(bug)
        })
        .catch((err) => {
            loggerService.error('Cannot get bug', err)
            res.status(400).send(`Cannot get bug: ${err.message}`)
        })
})

// Remove bug (Delete)
app.delete('/api/bug/:bugId', requireAuth, (req, res) => {
    const bugId = req.params.bugId

    bugService.remove(bugId, req.loggedinUser)
        .then(() => {
            console.log(`Bug ${bugId} removed!`)
            res.send('Bug removed successfully')
        })
        .catch((err) => {
            loggerService.error('Cannot remove bug', err)
            res.status(400).send(`Cannot remove bug: ${err.message}`)
        })
})

// Get Users (READ)
app.get('/api/user/', (req, res) => {
    userService.query()
        .then(users => res.json(users))
        .catch(err => res.status(500).send(err.message))
})

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params

    userService.getById(userId)
        .then(user => {
            res.send(user)
        })
        .catch(err => {
            loggerService.error('Cannot get user', err)
            res.status(400).send(`Cannot get user: ${err.message}`)
        })
})

// Remove user (Delete)
app.delete('/api/user/:userId', (req, res) => {
    const { userId } = req.params
    userService
        .remove(userId)
        .then(() => res.status(204).end())
        .catch(err => {
            console.log('Error deleting user:', err)
            res.status(404).send(err.message)
        })
})

app.post('/api/auth/login', (req, res) => {
    const credentials = req.body
    userService.checkLogin(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else res.status(401).send('Invalid Credentials')
        })
})

app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body
    userService.add(credentials)
        .then(user => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            loggerService.error('Cannot signup', err)
            res.status(400).send(`Cannot signup: ${err.message}`)
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('Loggedout..')
})

app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const port = 3030
app.listen(port, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
)