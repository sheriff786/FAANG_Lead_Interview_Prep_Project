import React from 'react'
import { useAppStore } from '../../store/useAppStore'
import TabBar from './TabBar'
import AnalysisTab from './AnalysisTab'
import StrategyTab from './StrategyTab'
import SimilarProblemsTab from './SimilarProblemsTab'
import ResourcesTab from './ResourcesTab'
import SystemDesignTab from './SystemDesignTab'
import QuickChips from './QuickChips'
import ChatInput from './ChatInput'

interface ChatAreaProps {
  onFollowUp: (msg: string) => void
}

export default function ChatArea({ onFollowUp }: ChatAreaProps) {
  const { activeTab, busy, messages } = useAppStore()
  const showChips = activeTab === 'analysis' && messages.length > 0

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <TabBar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {activeTab === 'analysis' && <AnalysisTab />}
        {activeTab === 'strategy' && <StrategyTab />}
        {activeTab === 'similar' && <SimilarProblemsTab />}
        {activeTab === 'resources' && <ResourcesTab />}
        {activeTab === 'systemdesign' && <SystemDesignTab />}
      </div>

      {activeTab === 'analysis' && (
        <>
          {showChips && <QuickChips onAsk={onFollowUp} />}
          <ChatInput onSend={onFollowUp} disabled={busy} />
        </>
      )}
    </div>
  )
}
