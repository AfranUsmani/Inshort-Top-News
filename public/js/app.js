// Progressive enhancement — no framework, CSP-safe (no inline handlers).

// 1. Hide broken article images (cards + featured lead).
function hideBroken(img) {
    var media = img.closest('.card__media, .featured__media')
    if (media) media.classList.add('is-broken')
}
document.querySelectorAll('.card__media img, .featured__media img').forEach(function (img) {
    img.addEventListener('error', function () { hideBroken(img) })
    if (img.complete && img.naturalWidth === 0) hideBroken(img)
})

// 2. Region dropdown: load that country's feed immediately on change.
var region = document.getElementById('region-select')
if (region) {
    region.addEventListener('change', function () {
        var q = document.querySelector('.search__input')
        if (q) q.value = '' // browsing a region clears any prior search term
        if (region.form) region.form.submit()
    })
}

// 3. Theme toggle (light/dark) — persisted; initial theme is set by theme.js.
var themeBtn = document.getElementById('theme-toggle')
if (themeBtn) {
    themeBtn.addEventListener('click', function () {
        var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
        document.documentElement.setAttribute('data-theme', next)
        try { localStorage.setItem('theme', next) } catch (e) {}
    })
}

// 4. Category chip filtering.
document.addEventListener('click', function (e) {
    var chip = e.target.closest('.chip')
    if (!chip) return

    var cat = chip.getAttribute('data-cat')
    document.querySelectorAll('.chip').forEach(function (c) {
        c.classList.toggle('is-active', c === chip)
    })
    document.querySelectorAll('.card').forEach(function (card) {
        var show = cat === 'all' || card.getAttribute('data-category') === cat
        card.style.display = show ? '' : 'none'
    })
})

// 5. Refresh the live feed when returning to a tab that's been idle > 10 min.
(function () {
    var awaySince = 0
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) { awaySince = Date.now(); return }
        if (awaySince && Date.now() - awaySince > 10 * 60 * 1000) location.reload()
    })
})()

// 6. Press "/" to focus the search box.
document.addEventListener('keydown', function (e) {
    if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return
    var el = document.activeElement
    if (el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return
    var input = document.querySelector('.search__input')
    if (input) { e.preventDefault(); input.focus() }
})

// 7. Back-to-top button.
var toTop = document.getElementById('to-top')
if (toTop) {
    window.addEventListener('scroll', function () {
        toTop.classList.toggle('is-visible', window.scrollY > 600)
    }, { passive: true })
    toTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    })
}
