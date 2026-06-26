import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { PLAYERS, searchMatch } from '../data/players';
import Avatar from './Avatar';
import PickleballIcon from './PickleballIcon';

export default function IdentityModal({ onSelect }) {
  const [search, setSearch] = useState('');

  const filteredPlayers = useMemo(() => {
    if (!search.trim()) return PLAYERS;
    return PLAYERS.filter(p => searchMatch(p.full_name, search));
  }, [search]);

  return (
    <div className="fixed inset-0 z-50 bg-surface flex flex-col">
      {/* Header */}
      <div className="px-5 pt-10 pb-4 shrink-0">
        <div className="flex flex-col items-center text-center mb-5">
          <PickleballIcon className="w-16 h-16 text-primary mb-3" />
          <h1 className="text-2xl font-extrabold text-text-primary mb-2">
            Chào bạn!
          </h1>
          <p className="text-base text-text-secondary">
            Bạn là ai trong sân?
          </p>
        </div>

        {/* Search - sticky at top */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder="Tìm tên (có dấu hoặc không dấu)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-surface-card rounded-xl text-base text-text-primary placeholder-text-muted border border-border focus:border-primary focus:outline-none transition-colors"
            autoComplete="off"
          />
        </div>
      </div>

      {/* Player Grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-8">
        <div className="grid grid-cols-2 gap-2.5">
          {filteredPlayers.map(player => (
            <button
              key={player.id}
              onClick={() => onSelect(player.id)}
              className="player-grid-item flex items-center gap-3 p-3.5 rounded-xl bg-surface-card border border-border hover:border-primary/50 text-left"
            >
              <Avatar player={player} size={44} />
              <div className="flex-1 min-w-0">
                <div className="text-base font-semibold text-text-primary truncate">
                  {player.full_name}
                </div>
                {player.current_dupr && (
                  <div className="text-sm text-text-muted mt-0.5">
                    DUPR {player.current_dupr}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
        
        {filteredPlayers.length === 0 && (
          <div className="text-center py-12 text-text-muted">
            <div className="text-3xl mb-2">🔍</div>
            <p className="text-base">Không tìm thấy người chơi</p>
          </div>
        )}
      </div>
    </div>
  );
}
