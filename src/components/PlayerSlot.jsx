import { useState } from 'react';
import { UserPlus, X, Search } from 'lucide-react';
import { PLAYERS, searchMatch } from '../data/players';
import Avatar from './Avatar';

export default function PlayerSlot({ label, selectedPlayerId, excludeIds = [], onSelect, onClear }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selectedPlayer = PLAYERS.find(p => p.id === selectedPlayerId);
  
  const availablePlayers = PLAYERS.filter(p => {
    if (excludeIds.includes(p.id)) return false;
    if (!search.trim()) return true;
    return searchMatch(p.full_name, search);
  });

  const handleSelect = (playerId) => {
    onSelect(playerId);
    setIsOpen(false);
    setSearch('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onClear();
  };

  return (
    <>
      {/* Slot Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`relative flex items-center gap-3 w-full p-3.5 rounded-xl border transition-all duration-200 ${
          selectedPlayer
            ? 'bg-surface-card border-primary/30 shadow-sm shadow-primary/10'
            : 'bg-surface-card/50 border-border border-dashed hover:border-primary/40'
        }`}
      >
        {selectedPlayer ? (
          <>
            <Avatar player={selectedPlayer} size={40} />
            <div className="flex-1 text-left min-w-0">
              <div className="text-[11px] text-text-muted font-medium uppercase tracking-wide">{label}</div>
              <div className="text-base font-semibold text-text-primary truncate">{selectedPlayer.full_name}</div>
            </div>
            <button
              onClick={handleClear}
              className="p-1.5 rounded-full hover:bg-surface-elevated transition-colors"
            >
              <X className="w-5 h-5 text-text-muted" />
            </button>
          </>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-surface-elevated flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-text-muted" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-[11px] text-text-muted font-medium uppercase tracking-wide">{label}</div>
              <div className="text-base text-text-muted">Chọn người chơi</div>
            </div>
          </>
        )}
      </button>

      {/* Player Picker Modal - full screen to avoid keyboard issues */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] bg-surface flex flex-col slide-up">
          {/* Sticky Header with search */}
          <div className="shrink-0 px-4 pt-4 pb-3 border-b border-border bg-surface">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-text-primary">{label}</h3>
              <button
                onClick={() => { setIsOpen(false); setSearch(''); }}
                className="p-2 rounded-full hover:bg-surface-card transition-colors"
              >
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                placeholder="Tìm tên (có dấu hoặc không dấu)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-surface-card rounded-xl text-base text-text-primary placeholder-text-muted border border-border focus:border-primary focus:outline-none transition-colors"
                autoComplete="off"
                autoFocus
              />
            </div>
          </div>

          {/* Player list - scrollable */}
          <div className="flex-1 overflow-y-auto px-4 py-3" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 24px)' }}>
            <div className="grid grid-cols-2 gap-2.5">
              {availablePlayers.map(player => (
                <button
                  key={player.id}
                  onClick={() => handleSelect(player.id)}
                  className="player-grid-item flex items-center gap-2.5 p-3 rounded-xl bg-surface-card border border-border text-left"
                >
                  <Avatar player={player} size={38} />
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-semibold text-text-primary truncate">
                      {player.full_name}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {availablePlayers.length === 0 && (
              <div className="text-center py-8 text-text-muted text-base">
                Không tìm thấy
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
