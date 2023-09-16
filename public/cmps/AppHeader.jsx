import { UserMsg } from "./UserMsg.jsx"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { userService } from "../services/user.service.js"

const { NavLink, Link } = ReactRouterDOM
const { useNavigate } = ReactRouter

export function AppHeader({ user, onSetUser }) {
    const navigate = useNavigate()

    function onLogout() {
        userService.logout()
            .then(() => {
                onSetUser(null)
                showSuccessMsg('Have a nice day!')
                navigate('/')
            })
            .catch((err) => {
                console.error('err: ', err)
                showErrorMsg('Oops! Try again!')
            })
    }

    return (
        <header className="app-header flex">
            <section className="header-container">
                <h1>BMS</h1>
                <nav className="app-nav">
                    <NavLink to="/" >Home</NavLink>
                    <NavLink to="/about" >About</NavLink>
                    <NavLink to="/bug" >Bugs</NavLink>
                    {user ? (
                        <section className="app-nav-login">
                            {user && user.isAdmin && <NavLink to="/user">Users</NavLink>}
                            <Link to={`/user/${user._id}`}>{user.fullname}</Link>
                            <button onClick={onLogout}>Logout</button>
                        </section>
                    ) : (
                        <section>
                            <NavLink to="/login">Login / Signup</NavLink>
                        </section>
                    )}
                </nav>
            </section>
            <UserMsg />
        </header>
    )
}