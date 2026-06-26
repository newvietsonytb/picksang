import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { getPlayerById } from './data/players';
import IdentityModal from './components/IdentityModal';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomeTab from './components/HomeTab';
import LeaderboardTab from './components/LeaderboardTab';
import AdminTab from './components/AdminTab';
import { supabase } from './lib/supabase';

export default function App() {
  const [currentPlayerId, setCurrentPlayerId] = useLocalStorage('current_player_id', null);
  const [matches, setMatches] = useState([]);
  const [dbPlayers, setDbPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [showIdentityModal, setShowIdentityModal] = useState(false);

  const currentPlayer = getPlayerById(currentPlayerId);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch matches
      const { data: matchesData } = await supabase
        .from('matches')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (matchesData) setMatches(matchesData);

      // Fetch players
      const { data: playersData } = await supabase
        .from('players')
        .select('*');
        
      if (playersData) setDbPlayers(playersData);
      
      setIsLoading(false);
    };

    fetchData();

    const channel = supabase
      .channel('public:matches')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setMatches(prev => {
            // Prevent duplicate if optimistic update already added it
            if (prev.some(m => m.id === payload.new.id)) return prev;
            // Add and sort by date descending
            const updated = [payload.new, ...prev];
            return updated.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          });
        } else if (payload.eventType === 'DELETE') {
          setMatches(prev => prev.filter(m => m.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleIdentitySelect = useCallback((playerId) => {
    setCurrentPlayerId(playerId);
    setShowIdentityModal(false);
  }, [setCurrentPlayerId]);

  const handleSwitchPlayer = useCallback(() => {
    setShowIdentityModal(true);
  }, []);

  const handleSaveMatch = useCallback(async (match) => {
    // Optimistic UI update
    setMatches(prev => [match, ...prev]);
    
    const { error } = await supabase.from('matches').insert(match);
    if (error) {
      console.error('Error saving match:', error);
      setMatches(prev => prev.filter(m => m.id !== match.id));
      alert("Lỗi khi lưu dữ liệu lên máy chủ!");
    }
  }, []);

  const handleDeleteMatch = useCallback(async (matchId) => {
    // Optimistic UI update
    setMatches(prev => prev.filter(m => m.id !== matchId));

    const { error } = await supabase.from('matches').delete().eq('id', matchId);
    if (error) {
      console.error('Error deleting match:', error);
      alert("Lỗi khi xoá dữ liệu trên máy chủ!");
      // Optionally re-fetch matches here to rollback
    }
  }, []);

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
            isLoading={isLoading}
            onSaveMatch={handleSaveMatch}
            onDeleteMatch={handleDeleteMatch}
          />
        )}
        {activeTab === 'leaderboard' && (
          <LeaderboardTab matches={matches} dbPlayers={dbPlayers} />
        )}
        {activeTab === 'admin' && (
          <AdminTab currentPlayer={currentPlayer} matches={matches} dbPlayers={dbPlayers} />
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
