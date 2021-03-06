const { log, addData, hydrateAndFilter } = require('cozy-konnector-libs')
const Splitwise = require('splitwise')
const SW_EXPENSE_DOCTYPE = 'com.splitwise.expenses'

let sw
const libs = {}

const translateError = e => {
  if (e.message.includes('authentication failed')) {
    return 'LOGIN_FAILED'
  } else {
    return 'UNKNOWN_ERROR'
  }
}

// The start function is run by the BaseKonnector instance only when it got all the account
// information (fields). When you run this connector yourself in "standalone" mode or "dev" mode,
// the account information come from ./konnector-dev-config.json file
libs.start = async fields => {
  log('info', 'Authenticating ...')
  let user
  try {
    user = await libs.authenticate(fields.consumerKey, fields.consumerSecret)
  } catch (e) {
    log('error', e)
    const msg = translateError(e)
    log('critical', msg)
    return
  }
  const username = user.first_name + ' ' + user.last_name
  log('info', 'Successfully logged in for ' + username)
  const expenses = await sw.getExpenses({ limit: 100 })
  return saveExpenses(expenses)
}

async function saveExpenses(expenses) {
  const options = {
    keys: ['id']
  }

  return hydrateAndFilter(expenses, SW_EXPENSE_DOCTYPE, options).then(
    expenses => addData(expenses, SW_EXPENSE_DOCTYPE, options)
  )
}

// this shows authentication using the [signin function](https://github.com/konnectors/libs/blob/master/packages/cozy-konnector-libs/docs/api.md#module_signin)
// even if this in another domain here, but it works as an example
libs.authenticate = (consumerKey, consumerSecret) => {
  sw = Splitwise({
    consumerKey,
    consumerSecret
  })

  return sw.getCurrentUser()
}

module.exports = libs
