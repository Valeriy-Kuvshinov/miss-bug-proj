import { userService } from "../services/user.service.js"
import { bugService } from "../services/bug.service.js"

const { useState, useEffect } = React

export function UsersList({ user }) {
    const [users, setUsers] = useState([])

    useEffect(() => {
        if (user && user.isAdmin) {
            userService.getAllUsers().then(fetchedUsers => {
                const nonAdminUsers = fetchedUsers.filter(u => u._id !== user._id)
                setUsers(nonAdminUsers)
            })
        }
    }, [user])

    const deleteUser = (userId) => {
        bugService.query({ ownerId: userId }).then(data => {
            if (data.bugs.length > 0) {
                alert("Cannot delete a user who owns bugs.")
                return
            }
            userService.deleteUser(userId).then(() => {
                setUsers(users.filter(u => u._id !== userId))
            })
        })
    }

    return (
        <section className="users-list-page">
            <h2>User List</h2>
            <ul className="users-list">
                {users.map(user => (
                    <li key={user._id}>
                        {user.username}
                        <img src="../assets/img/user.png" />
                        <button onClick={() => deleteUser(user._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </section>
    )
}