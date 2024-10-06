import { sendToBackground } from '@plasmohq/messaging'
import { Storage } from '@plasmohq/storage'
import '~style.css'

const storage = new Storage({
  area: 'local',
})

function IndexPopup() {
  const login = async () => {
    sendToBackground({ name: 'init-session' })
  }

  return (
    <div className="flex h-16 w-40 items-center justify-center">
      <button onClick={() => login()}>Login on rememr.com</button>
    </div>
  )
}

export default IndexPopup
