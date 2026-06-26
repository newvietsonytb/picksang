import { ChevronDown } from 'lucide-react';
import { getPlayerById } from '../data/players';
import Avatar from './Avatar';
import PickleballIcon from './PickleballIcon';

export default function Header({ currentPlayerId, onSwitchPlayer }) {
  const player = getPlayerById(currentPlayerId);
  if (!player) return null;

  return (
    <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur-lg border-b border-border" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          <PickleballIcon className="w-6 h-6 text-primary" />
          <h1 className="text-lg font-extrabold bg-gradient-to-r from-primary to-emerald-300 bg-clip-text text-transparent">
            Pick Sáng
          </h1>
        </div>
        <button
          onClick={onSwitchPlayer}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-card border border-border hover:border-primary/50 transition-colors"
        >
          <Avatar player={player} size={26} />
          <span className="text-sm font-medium text-text-secondary max-w-[100px] truncate">
            {player.full_name}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
        </button>
      </div>
    </header>
  );
}
