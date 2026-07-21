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

// 4. Category chip filtering (cards + the featured lead).
document.addEventListener('click', function (e) {
    var chip = e.target.closest('.chip')
    if (!chip) return

    var cat = chip.getAttribute('data-cat')
    document.querySelectorAll('.chip').forEach(function (c) {
        var active = c === chip
        c.classList.toggle('is-active', active)
        c.setAttribute('aria-pressed', active ? 'true' : 'false')
    })
    document.querySelectorAll('.card, .featured').forEach(function (item) {
        var show = cat === 'all' || item.getAttribute('data-category') === cat
        item.style.display = show ? '' : 'none'
    })
})

// 5. Soft-refresh the feed when returning to a tab idle > 10 min — swaps in
//    fresh headlines in place (no full reload), preserving scroll and theme.
(function () {
    var awaySince = 0
    var main = document.getElementById('main')
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) { awaySince = Date.now(); return }
        if (!main || !awaySince || Date.now() - awaySince < 10 * 60 * 1000) return
        awaySince = 0
        fetch(location.href, { headers: { 'X-Requested-With': 'fetch' } })
            .then(function (r) { return r.ok ? r.text() : null })
            .then(function (html) {
                if (!html) return
                var fresh = new DOMParser().parseFromString(html, 'text/html').getElementById('main')
                if (fresh) main.innerHTML = fresh.innerHTML
            })
            .catch(function () {})
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
