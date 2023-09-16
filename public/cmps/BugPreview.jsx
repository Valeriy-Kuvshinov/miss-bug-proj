export function BugPreview({ bug }) {
    return (
        <article className="bug-preview">
            <h4>{bug.title}</h4>
            <h1><i className="fa-solid fa-bug"></i></h1>
            {bug.owner && <h4>Owner: {bug.owner.fullname}</h4>}
            <p>Severity: <span>{bug.severity}</span></p>
        </article>
    )
}
