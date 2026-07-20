// Category chip filtering — progressive enhancement, no framework.
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
