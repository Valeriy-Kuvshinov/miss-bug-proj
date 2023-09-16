import { BugList } from "../cmps/BugList.jsx"
import { userService } from "../services/user.service.js"
import { bugService } from "../services/bug.service.js"

const { useState, useEffect } = React
const { useParams } = ReactRouterDOM

export function UserDetails() {
    const { userId } = useParams()
    const [userDetails, setUserDetails] = useState(null)
    const [userBugs, setUserBugs] = useState([])

    useEffect(() => {
        userService.getById(userId)
            .then(user => {
                setUserDetails(user)
                const filter = user.isAdmin ? {} : { ownerId: user._id }
                return bugService.query(filter)
            })
            .then(data => {
                if (Array.isArray(data.bugs)) setUserBugs(data.bugs)
                else console.error("Fetched bugs is not an array:", data.bugs)
            })
            .catch(err => console.error('Error:', err))
    }, [userId])

    if (!userDetails) return <div>Loading...</div>

    return (
        <section className="user-page">
            <div className="user-profile">
                <h2>User Details</h2>
                <div className="profile-content">
                    <div className="profile-text">
                        <p>Username: {userDetails.username}</p>
                        <p>Full Name: {userDetails.fullname}</p>
                        <p>ID: {userDetails._id}</p>
                    </div>
                    <div className="profile-image">
                        <img src="../assets/img/user.png" />
                    </div>
                </div>
            </div>
            <h3>User Bugs</h3>
            <BugList bugs={userBugs} />
        </section>
    )
}