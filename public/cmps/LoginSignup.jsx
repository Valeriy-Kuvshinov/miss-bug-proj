import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { userService } from '../services/user.service.js'
import { LoginForm } from './LoginForm.jsx'

const { useState } = React
const { useNavigate } = ReactRouter

export function LoginSignup({ onSetUser }) {
    const [isSignup, setIsSignUp] = useState(false)
    const navigate = useNavigate()

    function onLogin(credentials) {
        isSignup ? signup(credentials) : login(credentials)
    }

    function login(credentials) {
        userService.login(credentials)
            .then(user => {
                onSetUser(user)
                navigate('/')
                showSuccessMsg('Logged in successfully')
            })
            .catch((err) => {
                console.error('Error:', err)
                showErrorMsg('Oops try again')
            })
    }

    function signup(credentials) {
        userService.signup(credentials)
            .then(user => {
                onSetUser(user)
                navigate('/')
                showSuccessMsg('Signed in successfully')
            })
            .catch((err) => {
                console.error('Error:', err)
                showErrorMsg('Oops try again')
            })
    }

    return (
        <div className="login-page">
            <div className="login-form">
                <LoginForm
                    onLogin={onLogin}
                    isSignup={isSignup}
                />
                <div className="btns">
                    <a href="#" onClick={() => setIsSignUp(!isSignup)}>
                        {isSignup ?
                            'Already a member? Login' :
                            'New user? Signup here'
                        }
                    </a >
                </div>
            </div>
        </div >
    )
}