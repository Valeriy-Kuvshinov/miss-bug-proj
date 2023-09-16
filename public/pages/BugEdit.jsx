import { bugService } from "../services/bug.service.js"
import { showErrorMsg } from "../services/event-bus.service.js"

const { useState, useEffect } = React
const { useNavigate, useParams } = ReactRouterDOM

export function BugEdit() {
    const [bugToEdit, setBugToEdit] = useState(bugService.getEmptyBug())
    const navigate = useNavigate()
    const params = useParams()

    useEffect(() => {
        if (params.bugId) loadBug()
    }, [])

    function loadBug() {
        bugService.get(params.bugId)
            .then(bug => {
                if (Array.isArray(bug.labels)) {
                    bug.labels = bug.labels.join(", ")
                }
                setBugToEdit(bug)
            })
            .catch((err) => {
                console.error('err: ', err)
                showErrorMsg('Cannot load bug')
            })
    }

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break
            case 'checkbox':
                value = target.checked
                break
            default:
                break
        }
        setBugToEdit(prevBugToEdit => ({ ...prevBugToEdit, [field]: value }))
    }

    function onSaveBug(ev) {
        ev.preventDefault()

        const fixedLabels = Array.isArray(bugToEdit.labels) ? bugToEdit.labels :
            (typeof bugToEdit.labels === 'string' ?
                bugToEdit.labels.split(", ").map(label => label.trim()) :
                [])

        const fixedBugToEdit = {
            ...bugToEdit,
            labels: fixedLabels,
        }
        bugService.save(fixedBugToEdit)
            .then(() => navigate('/bug'))
            .catch(err => showErrorMsg('Cannot save bug'))
    }

    const { title, severity, labels, description } = bugToEdit

    return (
        <section className="bug-edit-page">
            <form onSubmit={onSaveBug} >
                <label htmlFor="title">Bug Title:</label>
                <input onChange={handleChange} value={title} type="text" name="title" id="title" />

                <label htmlFor="description">Description:</label>
                <textarea onChange={handleChange} value={description} name="description" id="description"></textarea>

                <label htmlFor="severity">Max Severity:</label>
                <input onChange={handleChange} value={severity} type="number" min={0} max={10} name="severity" id="severity" placeholder="0" />

                <label htmlFor="labels">Labels:</label>
                <input onChange={handleChange} value={labels} type="text" name="labels" id="labels" placeholder="comma-separated labels" />
                <p style={{ textDecoration: 'underline' }}>Available labels</p>
                <p>critical, need-CR, dev-branch</p>
                <button>Save</button>
            </form>
        </section>
    )
}