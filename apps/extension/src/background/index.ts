import { browser } from 'browser-namespace'

export {}

browser.action.onClicked.addListener(() => {
  browser.runtime.openOptionsPage()
})
