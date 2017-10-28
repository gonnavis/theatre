// @flow
import withDeps from '../withDeps'
import deriveFromPropOfADictAtom from './deriveFromPropOfADictAtom'
// import deriveFromPropOfADictAtom from './deriveFromPropOfADictAtom'
import * as D from '$shared/DataVerse'

describe('deriveFromPropOfADictAtom', () => {
  it('events should work', (done) => {
    const m = D.atoms.dict({a: D.atoms.box(1), b: D.atoms.box(3)})

    const aD = deriveFromPropOfADictAtom(m, 'a')
    const bD = deriveFromPropOfADictAtom(m, 'b')
    const final = aD.map((n) => bD.map((m) => m.getValue() + n.getValue())).flattenDeep(7)

    expect(final.getValue()).toEqual(4)
    m.setProp('a', D.atoms.box(2))
    expect(final.getValue()).toEqual(5)

    m.setProp('b', D.atoms.box(4))
    expect(final.getValue()).toEqual(6)

    const ticker = new D.Ticker()

    const adEvents = []

    aD.changes(ticker).tap((newBox) => {
      adEvents.push(newBox.getValue())
    })

    expect(adEvents).toHaveLength(0)
    m.setProp('a', D.atoms.box(3))
    expect(adEvents).toHaveLength(0)

    ticker.tick()
    expect(adEvents).toMatchObject([3])

    const finalEvents = []
    final.changes(ticker).tap((v) => {finalEvents.push(v)})
    m.setProp('a', D.atoms.box(4))

    expect(finalEvents).toHaveLength(0)
    ticker.tick()
    expect(finalEvents).toMatchObject([8])
    expect(adEvents).toMatchObject([3, 4])

    m.setProp('b', D.atoms.box(5))
    expect(finalEvents).toHaveLength(1)
    ticker.tick()
    expect(adEvents).toHaveLength(2)
    expect(finalEvents).toHaveLength(2)
    expect(finalEvents).toMatchObject([8, 9])

    done()
  })

  it('more', () => {
    const ticker = new D.Ticker()
    const a = D.atoms.box('a')
    const aD = a.derivation()
    const b = D.atoms.box('b')
    const bD = b.derivation()
    const cD = aD.map((aValue) => bD.map((bValue) => withDeps({}, () => aValue + bValue))).flattenDeep(7)

    expect(cD.getValue()).toEqual('ab')
    const changes = []
    cD.changes(ticker).tap((c) => {changes.push(c)})

    b.set('bb')
    ticker.tick()
    expect(changes).toMatchObject(['abb'])
  });

  (function() {

  })
})