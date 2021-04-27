import assert from 'assert'

import wdio from 'webdriverio'

// jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000
const opts = {
  runner: 'local',
  path: '/wd/hub',
  port: 4723,
  maxInstances: 10,
  waitforTimeout: 10000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  services: ['chromedriver', 'appium'],
  appium: {},
  capabilities: {
    platformName: 'android',
    deviceName: 'emulator-5554',
    app:
      '/Users/mickeylock/Documents/04_Mobiilityö/group-project/vehonaattorit-organization/VEHOGO/e2e/VehoKimppa_1.0.0.apk',
    automationName: 'UiAutomator2',
    appWaitForLaunch: false,
  },
}

describe('Expo test example', function () {
  let client
  beforeEach(async function () {
    client = await wdio.remote(opts)
  })
  afterEach(async function () {
    await client.deleteSession()
  })
  it('should display welcome text', async function () {
    await client.pause(2000)
    const xpath =
      '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.TextView'
    const field = await client.$(xpath)
    const visible = await field.isDisplayed()
    assert(visible)
    const text = await field.getText()
    assert.equal(text, 'Open up App.js to start working on your app!')
  })
})
