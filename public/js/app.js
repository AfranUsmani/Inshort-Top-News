// Progressive enhancement — no framework, CSP-safe (no inline handlers).

// 1. Hide broken article images.
function hideBroken(img) {
    var media = img.closest('.card__media')
    if (media) media.classList.add('is-broken')
}
document.querySelectorAll('.card__media img').forEach(function (img) {
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

// 3. Category chip filtering.
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
