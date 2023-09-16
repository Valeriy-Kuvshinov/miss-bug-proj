
const BASE_URL = '/api/bug/'

export const bugService = {
    query,
    get,
    remove,
    save,
    getEmptyBug,
    getDefaultFilter,
}

function query(filterBy = {}) {
    return axios.get(BASE_URL, { params: filterBy }).then(res => res.data)
}

function get(bugId) {
    return axios.get(BASE_URL + bugId).then(res => res.data)
}

function remove(bugId) {
    return axios.delete(BASE_URL + bugId).then(res => res.data)
}

function save(bug) {
    const method = bug._id ? 'put' : 'post'
    return axios[method](BASE_URL, bug).then(res => res.data)
}

function getEmptyBug(title = '', description = '', severity = '', createdAt = Date.now(), labels = []) {
    return { title, description, severity, createdAt, labels }
}

function getDefaultFilter() {
    return {
        title: '',
        minSeverity: '',
        pageIdx: 0,
        ownerId: ''
    }
}