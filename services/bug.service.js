import { utilService } from "./utils.service.js"
import fs from 'fs'

export const bugService = {
    query,
    getById,
    remove,
    save
}
const PAGE_SIZE = 6
let bugs = utilService.readJsonFile('data/bug.json')

function query(filterBy) {
    let bugsToReturn = [...bugs]
    const totalCount = bugsToReturn.length
    // Filtering
    if (filterBy.title) {
        const regExp = new RegExp(filterBy.title, 'i')
        bugsToReturn = bugsToReturn.filter(bug => regExp.test(bug.title))
    }
    if (filterBy.minSeverity) {
        bugsToReturn = bugsToReturn.filter(bug => bug.severity >= filterBy.minSeverity)
    }
    if (filterBy.labels) {
        bugsToReturn = bugsToReturn.filter(bug => bug.labels.includes(filterBy.labels))
    }
    if (filterBy.ownerId) {
        bugsToReturn = bugsToReturn.filter(bug => bug.owner._id === filterBy.ownerId)
    }
    // Sorting
    if (filterBy.sortBy) {
        const direction = filterBy.sortDir === '-1' ? -1 : 1
        bugsToReturn.sort((a, b) => {
            if (a[filterBy.sortBy] < b[filterBy.sortBy]) return -1 * direction
            if (a[filterBy.sortBy] > b[filterBy.sortBy]) return 1 * direction
            return 0
        })
    }
    // Paging
    if (filterBy.pageIdx !== undefined) {
        const startIdx = filterBy.pageIdx * PAGE_SIZE;
        bugsToReturn = bugsToReturn.slice(startIdx, startIdx + PAGE_SIZE)
    }
    return Promise.resolve({ bugs: bugsToReturn, totalCount })
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)
}

function remove(bugId, loggedinUser) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    if (idx === -1) return Promise.reject('No such bug!')
    const bug = bugs[idx]
    if (!loggedinUser.isAdmin &&
        bug.owner._id !== loggedinUser._id) {
        return Promise.reject('Not your bug!')
    }
    bugs.splice(idx, 1)
    return _saveBugsToFile()
}

function save(bug, loggedinUser) {
    console.log("Logged-in user:", loggedinUser)
    const { _id, fullname, username } = loggedinUser
    const minimalOwnerInfo = { _id, fullname, username }

    if (bug._id) {
        const bugIdx = bugs.findIndex(currBug => currBug._id === bug._id)
        if (bugs[bugIdx].owner._id !== loggedinUser._id) return Promise.reject('Not your bug!')
        bugs[bugIdx] = { ...bug, owner: minimalOwnerInfo }
    } else {
        bug._id = utilService.makeId()
        bug.owner = minimalOwnerInfo
        bugs.unshift(bug)
    }
    return _saveBugsToFile().then(() => bug)
}
function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 2)
        fs.writeFile('data/bug.json', data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}