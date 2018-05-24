const lib = require('./lib')
jest.mock('cozy-konnector-libs', () => {
  return {
    log: jest.fn()
  }
})

describe('authentication', () => {
  it('should return LOGIN_FAILED if authentication fails', () => {
    const log = require('cozy-konnector-libs').log
    lib.authenticate = jest.fn().mockImplementation(() => {
      throw new Error(
        'getCurrentUser - getCurrentUser - authentication failed - client error'
      )
    })
    lib.start({})
    expect(log).toHaveBeenLastCalledWith('critical', 'LOGIN_FAILED')
  })

  it('should return UNKNOWN_ERROR if authentication fails for an unknown reason', () => {
    const log = require('cozy-konnector-libs').log
    lib.authenticate = jest.fn().mockImplementation(() => {
      throw new Error()
    })
    lib.start({})
    expect(log).toHaveBeenLastCalledWith('critical', 'UNKNOWN_ERROR')
  })
})
