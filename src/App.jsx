import { useState, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { getPlayerById } from './data/players';
import IdentityModal from './components/IdentityModal';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomeTab from './components/HomeTab';
import LeaderboardTab from './components/LeaderboardTab';
import AdminTab from './components/AdminTab';

export default function App() {
  const [currentPlayerId, setCurrentPlayerId] = useLocalStorage('current_player_id', null);
  const [matches, setMatches] = useLocalStorage('picksang_matches', []);
  const [activeTab, setActiveTab] = useState('home');
  const [showIdentityModal, setShowIdentityModal] = useState(false);

  const currentPlayer = getPlayerById(currentPlayerId);

  const handleIdentitySelect = useCallback((playerId) => {
    setCurrentPlayerId(playerId);
    setShowIdentityModal(false);
  }, [setCurrentPlayerId]);

  const handleSwitchPlayer = useCallback(() => {
    setShowIdentityModal(true);
  }, []);

  const handleSaveMatch = useCallback((match) => {
    setMatches(prev => [match, ...prev]);
  }, [setMatches]);

  const handleDeleteMatch = useCallback((matchId) => {
    setMatches(prev => prev.filter(m => m.id !== matchId));
  }, [setMatches]);

  // First time: show identity modal
  if (!currentPlayerId || !currentPlayer) {
    return <IdentityModal onSelect={handleIdentitySelect} />;
  }

  return (
    <div className="min-h-dvh bg-surface flex flex-col max-w-lg mx-auto">
      <Header
        currentPlayerId={currentPlayerId}
        onSwitchPlayer={handleSwitchPlayer}
      />

      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeTab
            currentPlayerId={currentPlayerId}
            currentPlayer={currentPlayer}
            matches={matches}
            onSaveMatch={handleSaveMatch}
            onDeleteMatch={handleDeleteMatch}
          />
        )}
        {activeTab === 'leaderboard' && (
          <LeaderboardTab matches={matches} />
        )}
        {activeTab === 'admin' && (
          <AdminTab currentPlayer={currentPlayer} matches={matches} />
        )}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Switch identity modal */}
      {showIdentityModal && (
        <IdentityModal onSelect={handleIdentitySelect} />
      )}
    </div>
  );
}
