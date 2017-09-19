'use strict'

const analyser = require('../analyser')

const memory = require('../locators/memory')
const directory = require('../locators/directory')

const local = require('../repositories/local')
const remote = require('../repositories/remote')

describe('mygreat', () => {
  const localInstance = local(directory('specs/stubs/migrations/*.js'))
  const remoteInstance = remote(memory([{
    _id: '832185ad-1041-2343-2342-2a80a7c23c4b',
    files: [
      '20170914202400',
      '20170914205000',
      '20170914210300',
    ],
    createdAt: new Date('2017-09-19T19:46:50.000Z')
  }]))

  describe('analyser(local, remote)', () => {
    const analyserInstance = analyser(localInstance, remoteInstance)

    describe('.analyse() : Promise<Object>', () => {
      it('returns a analysed-files-colleciton object containing all merged files from both local and remote location', () => {
        return expect(
          analyserInstance.analyse()
                          .then(collection => collection.all())
        ).to.eventually.be.deep.equals([
          { name: '20170914182600', locations: [ 'local' ] },
          { name: '20170914202400', locations: [ 'remote', 'local' ] },
          { name: '20170914205000', locations: [ 'remote' ] },
          { name: '20170914210300', locations: [ 'remote', 'local' ] },
          { name: '20170914213400', locations: [ 'local' ] },
          { name: '20170914213500', locations: [ 'local' ] }
        ])
      })
    })
  })
})