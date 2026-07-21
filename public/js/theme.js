// Runs in <head> (blocking) BEFORE first paint to avoid a flash of the wrong
// theme. Resolves: saved choice -> system preference -> light.
(function () {
    try {
        var saved = localStorage.getItem('theme')
        var theme = saved || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        document.documentElement.setAttribute('data-theme', theme)
    } catch (e) {}
})()
