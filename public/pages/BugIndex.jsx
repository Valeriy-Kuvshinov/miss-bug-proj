import { BugFilter } from "../cmps/BugFilter.jsx"
import { BugSort } from "../cmps/BugSort.jsx"
import { BugList } from "../cmps/BugList.jsx"
import { bugService } from "../services/bug.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { utilService } from "../services/util.service.js"

const { useState, useEffect, useRef } = React

export function BugIndex({ user }) {
    const [bugsData, setBugsData] = useState({ bugs: null, totalCount: 0 })
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
    const [prevPageIdx, setPrevPageIdx] = useState(null)
    const debouncedSetFilter = useRef(utilService.debounce(onSetFilterBy, 500))
    const debouncedSetSort = useRef(utilService.debounce(onSetSort, 500))

    useEffect(() => {
        bugService.query(filterBy)
            .then(data => setBugsData({ bugs: data.bugs, totalCount: data.totalCount }))
            .catch(err => console.error('err:', err))
    }, [filterBy])
    const totalPages = Math.ceil(bugsData.totalCount / 6)

    function onRemoveBug(bugId) {
        bugService.remove(bugId)
            .then(() => {
                setBugsData(prevData => ({
                    ...prevData,
                    bugs: prevData.bugs.filter(bug => bug._id !== bugId)
                }))
                showSuccessMsg(`Bug Removed! ${bugId}`)
            })
            .catch(err => {
                console.error('err:', err)
                showErrorMsg('Problem Removing ' + bugId)
            })
    }

    function onSetFilterBy(filterBy) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    function onSetSort(sortCriteria) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...sortCriteria }))
    }

    function onChangePageIdx(diff) {
        const newPageIdx = filterBy.pageIdx + diff

        if (newPageIdx < 0 || newPageIdx >= totalPages) return

        setPrevPageIdx(filterBy.pageIdx)
        setFilterBy(prevFilter => ({ ...prevFilter, pageIdx: newPageIdx }))
    }

    function togglePagination() {
        if (filterBy.pageIdx === undefined) {
            if (prevPageIdx !== null) {
                setFilterBy(prevFilter => ({ ...prevFilter, pageIdx: prevPageIdx }))
            }
        } else {
            setPrevPageIdx(filterBy.pageIdx)
            setFilterBy(prevFilter => ({ ...prevFilter, pageIdx: undefined }))
        }
    }
    if (!bugsData.bugs) return <div>Loading...</div>

    return (
        <section className="bug-index">
            <section className="bug-controls">
                <h2>Bug Controls</h2>
                <div className="grid-container">
                    <BugFilter filterBy={filterBy} onSetFilterBy={debouncedSetFilter.current} />
                    <BugSort setSort={debouncedSetSort.current} user={user} />
                </div>
            </section>
            <BugList bugs={bugsData.bugs} onRemoveBug={onRemoveBug} />
            <section className="bug-pagination">
                <div>
                    <button onClick={() => { onChangePageIdx(-1) }}><i className="fa-solid fa-square-caret-left"></i></button>
                    {filterBy.pageIdx + 1}
                    <button onClick={() => { onChangePageIdx(1) }}><i className="fa-solid fa-square-caret-right"></i></button>
                    <button onClick={togglePagination}>
                        {filterBy.pageIdx === undefined ? 'Enable Pages' : 'Disable Pages'}
                    </button>
                </div>
            </section>
        </section>
    )
}