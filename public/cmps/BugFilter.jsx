const { useState, useEffect } = React

export function BugFilter({ filterBy, onSetFilterBy }) {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)
    const filterLabels = ["critical", "need-CR", "dev-branch"]

    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

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
        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilterBy(filterByToEdit)
        console.log("Filter By to Edit:", filterByToEdit)
    }

    const { title, minSeverity, label } = filterByToEdit

    return (
        <section className="bug-filter">
            <form onSubmit={onSubmitFilter}>
                <h3>Bug Filtering</h3>
                <div>
                    <label htmlFor="title">Title: </label>
                    <input value={title} onChange={handleChange} type="text" placeholder="By bug title" id="title" name="title" />
                </div>
                <div>
                    <label htmlFor="minSeverity">Severity: </label>
                    <input value={minSeverity} onChange={handleChange} type="number" min={0} max={10} placeholder="By severity" id="minSeverity" name="minSeverity" />
                </div>
                <div>
                    <label htmlFor="label">Labels: </label>
                    <select value={label} onChange={handleChange} id="label" name="label">
                        <option value="">Select Label</option>
                        {filterLabels.map((lbl, idx) => <option key={idx} value={lbl}>{lbl}</option>)}
                    </select>
                </div>
            </form>
        </section>
    )
}