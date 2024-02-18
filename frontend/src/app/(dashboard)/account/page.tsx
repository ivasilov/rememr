'use server'
import { Icon } from '@/src/components/icon'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@/src/components/tabs'
import { checkAuthentication } from '@/src/lib/supabase'
import { faCog, faFileImport } from '@fortawesome/free-solid-svg-icons'
import { Imports } from './imports'
import { Settings } from './settings'

const AccountPage = async () => {
  await checkAuthentication()

  return (
    <div className="container mx-auto mt-8">
      <TabGroup defaultIndex={0}>
        <TabList>
          <Tab>
            <Icon name={faCog} size="lg" className="mr-1" />
            Settings
          </Tab>
          <Tab>
            <Icon name={faFileImport} size="lg" className="mr-1" />
            Imports
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Settings />
          </TabPanel>
          <TabPanel>
            <Imports />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  )
}

export default AccountPage
