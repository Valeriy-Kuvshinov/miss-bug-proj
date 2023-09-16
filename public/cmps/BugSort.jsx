const { Link } = ReactRouterDOM

export function BugSort({ setSort, user }) {
    const handleChange = (e) => {
        const { name, value } = e.target
        setSort({ [name]: value })
    }

    return (
        <section className="bug-sort form">
            <h3>Bug Sorting</h3>
            <div>
                <label>Sort By:</label>
                <select name="sortBy" onChange={handleChange}>
                    <option value="">None</option>
                    <option value="title">Title</option>
                    <option value="severity">Severity</option>
                    <option value="createdAt">Created At</option>
                </select>
            </div>
            <div>
                <label>Direction:</label>
                <select name="sortDir" onChange={handleChange}>
                    <option value="1">Ascending</option>
                    <option value="-1">Descending</option>
                </select>
            </div>
            <div>
                {user ? (
                    <Link to="/bug/edit" className="add-bug-btn">Add Bug</Link>
                ) : (
                    <p></p>
                )}
            </div>
        </section>
    )
}