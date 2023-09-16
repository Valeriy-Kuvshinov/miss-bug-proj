import { bugService } from "../services/bug.service.js"
import { showErrorMsg } from "../services/event-bus.service.js"

const { useState, useEffect } = React
const { useParams, useNavigate, Link } = ReactRouterDOM

export function BugDetails() {
    const [bug, setBug] = useState(null)
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadBug()
    }, [params.bugId])

    function loadBug() {
        bugService.get(params.bugId)
            .then(setBug)
            .catch(err => {
                navigate('/bug')
                showErrorMsg('Please log in to view')
            })
    }

    function onBack() {
        navigate('/bug')
    }

    console.log('render')
    if (!bug) return <div>Loading...</div>

    return (
        <section className="bug-details-page">
            <section className="bug-details">
                <h3>Bug Details</h3>
                <h4>{bug.title}</h4>
                <p>Description: <span>{bug.description}</span></p>
                <p>Severity: <span>{bug.severity}</span></p>
                <p>Labels: <span>{Array.isArray(bug.labels) ? bug.labels.join(", ") : bug.labels}</span></p>
                <h4>Owner: {bug.owner.fullname}</h4>
                <h1><i className="fa-solid fa-bug"></i></h1>

                <Link to="/bug/def123">Prev</Link>
                <button onClick={onBack} >Back</button>
                <Link to="/bug/def123">Next</Link>
            </section>
        </section>
    )
}