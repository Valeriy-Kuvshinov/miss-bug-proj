import { AppHeader } from "./cmps/AppHeader.jsx"
import { Team } from "./cmps/Team.jsx"
import { Vision } from "./cmps/Vision.jsx"
import { About } from "./pages/About.jsx"
import { BugDetails } from "./pages/BugDetails.jsx"
import { BugEdit } from "./pages/BugEdit.jsx"
import { BugIndex } from "./pages/BugIndex.jsx"
import { Home } from "./pages/Home.jsx"
import { LoginSignup } from "./cmps/LoginSignup.jsx"
import { UserDetails } from "./pages/UserDetails.jsx"
import { UsersList } from "./pages/UsersList.jsx"
import { userService } from "./services/user.service.js"

const Router = ReactRouterDOM.BrowserRouter
const { Routes, Route } = ReactRouterDOM
const { useState } = React

export function App() {
    const [user, setUser] = useState(userService.getLoggedinUser())

    function onSetUser(user) {
        setUser(user)
    }

    return (
        <Router>
            <section className="app flex flex-column">
                <AppHeader user={user} onSetUser={onSetUser} />
                <main>
                    <Routes>
                        <Route path="/" element={<Home user={user} />} />
                        <Route path="/login" element={<LoginSignup onSetUser={onSetUser} />} />
                        <Route path="/about" element={<About />}>
                            <Route path="team" element={<Team />} />
                            <Route path="vision" element={<Vision />} />
                        </Route>
                        <Route path="/user/:userId" element={<UserDetails user={user} />} />
                        <Route path="/user" element={<UsersList user={user} />} />
                        <Route path="/bug/:bugId" element={<BugDetails />} />
                        <Route path="/bug/edit/:bugId" element={<BugEdit />} />
                        <Route path="/bug/edit" element={<BugEdit />} />
                        <Route path="/bug" element={<BugIndex user={user} />} />
                    </Routes>
                </main>
            </section>
        </Router>
    )
} 