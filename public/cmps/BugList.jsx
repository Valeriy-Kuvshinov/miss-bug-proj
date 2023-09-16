import { BugPreview } from "./BugPreview.jsx"
import { userService } from "../services/user.service.js"
const { Link } = ReactRouterDOM

export function BugList({ bugs, onRemoveBug }) {
    const user = userService.getLoggedinUser()

    function isOwner(bug) {
        if (!user) return false
        return user.isAdmin || bug.owner._id === user._id
    }

    return (
        <ul className="bug-list">
            {bugs.map(bug =>
                <li key={bug._id}>
                    <BugPreview bug={bug} />
                    <section>
                        <button><Link to={`/bug/${bug._id}`}><i className="fa-solid fa-circle-info"></i></Link></button>
                        {
                            isOwner(bug) &&
                            <div>
                                <button onClick={() => onRemoveBug(bug._id)}><i className="fa-solid fa-trash-can"></i></button>
                                <button><Link to={`/bug/edit/${bug._id}`}><i className="fa-solid fa-file-pen"></i></Link></button>
                            </div>
                        }
                    </section>
                </li>
            )}
        </ul>
    )
}