const { Outlet, Link } = ReactRouterDOM

export function About() {

    return (
        <section className="about-page">
            <div>
                <h1>About us...</h1>
                <h4>BMS - So what's bugging ya?</h4>
                <p>We are but a team of amatuer folks, who strive to make a better world for the consumers.</p>
                <p>Using the latest debug tools, we aim to to find and fix every single bug that exists!</p>

                <nav>
                    <Link to="/about/team">Team</Link>
                    <Link to="/about/vision">Vision</Link>
                </nav>

                <section className="about-page-outlet">
                    <Outlet/>
                </section>
            </div>
        </section>
    )
}