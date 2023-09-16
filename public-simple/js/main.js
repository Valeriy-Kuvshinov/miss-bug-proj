
window.loadBugs = loadBugs

function loadBugs() {
    fetch('/api/bug')
        .then(res => res.json())
        .then(bugs => {
            console.log('Got bugs', bugs)
            renderBugs(bugs)
        })
}

function renderBugs(bugs) {
    const strHTMLs = bugs.map(bugs => `<li>${bugs.title}</li>`)
    const el = document.querySelector('.bug-list')
    el.innerHTML = strHTMLs.join('')
}