import { browser } from 'browser-namespace'

browser.action.onClicked.addListener(() => {
  browser.runtime.openOptionsPage()
})
