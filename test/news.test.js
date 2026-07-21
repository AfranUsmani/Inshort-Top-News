const { test } = require('node:test')
const assert = require('node:assert')
const {
    categorize,
    splitTitle,
    timeAgo,
    REGIONS,
    DEFAULT_REGION,
    regionByCode,
} = require('../src/services/news')

test('splitTitle separates headline and source', () => {
    assert.deepStrictEqual(splitTitle('Big story unfolds - The Hindu'), {
        title: 'Big story unfolds',
        source: 'The Hindu',
    })
})

test('splitTitle handles a missing source', () => {
    assert.deepStrictEqual(splitTitle('No trailing source here'), {
        title: 'No trailing source here',
        source: '',
    })
})

test('categorize tags known topics', () => {
    assert.strictEqual(categorize('stock market hits record high'), 'Business')
    assert.strictEqual(categorize('india wins the cricket match'), 'Sports')
    assert.strictEqual(categorize('new bollywood film released this friday'), 'Entertainment')
    assert.strictEqual(categorize('nasa launches a rocket into space'), 'Science')
})

test('categorize falls back to Top for unmatched text', () => {
    assert.strictEqual(categorize('an ordinary uncategorizable sentence'), 'Top')
})

test('timeAgo formats relative time', () => {
    const iso = (min) => new Date(Date.now() - min * 60000).toISOString()
    assert.strictEqual(timeAgo(iso(0)), 'just now')
    assert.strictEqual(timeAgo(iso(5)), '5m ago')
    assert.strictEqual(timeAgo(iso(120)), '2h ago')
    assert.strictEqual(timeAgo(iso(60 * 24 * 2)), '2d ago')
    assert.strictEqual(timeAgo(''), '')
    assert.strictEqual(timeAgo('not-a-date'), '')
})

test('regions expose the world default and country lookups', () => {
    assert.ok(REGIONS.length >= 10, 'expected at least 10 regions')
    assert.strictEqual(DEFAULT_REGION, 'world')
    assert.strictEqual(regionByCode('us').label, 'United States')
    // unknown codes fall back to the default region
    assert.strictEqual(regionByCode('zz-not-real').code, 'world')
})
