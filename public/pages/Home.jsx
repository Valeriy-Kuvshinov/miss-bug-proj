export function Home({ user }) {
    return (
        <section className="home-page">
            <h2>{user ? `Welcome back ${user.fullname}!` : "Welcome to our site!"}</h2>
            <div>
                <h4>So what's bugging you today?</h4>
                <img src="assets/img/bug.png" />
            </div>
        </section>
    )
}