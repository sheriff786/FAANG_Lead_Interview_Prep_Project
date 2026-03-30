import Header from './components/Header'
import LeftPanel from './components/LeftPanel/LeftPanel'
import ChatArea from './components/ChatArea/ChatArea'
import { useAnalysis } from './hooks/useAgents'
import { useFollowUp } from './hooks/useFollowUp'

export default function App() {
  const { startAnalysis } = useAnalysis()
  const { handleFollowUp } = useFollowUp()

  return (
    <>
      <Header />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', height: 'calc(100vh - 57px)' }}>
        <LeftPanel onAnalyze={startAnalysis} />
        <ChatArea onFollowUp={handleFollowUp} />
      </div>
    </>
  )
}
