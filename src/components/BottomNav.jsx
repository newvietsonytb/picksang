import { ClipboardList, Trophy, Settings } from 'lucide-react';

const tabs = [
  { id: 'home', label: 'Nhập điểm', icon: ClipboardList },
  { id: 'leaderboard', label: 'Xếp hạng', icon: Trophy },
  { id: 'admin', label: 'Quản lý', icon: Settings },
];

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface-card/95 backdrop-blur-lg border-t border-border" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 8px)' }}>
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1.5 px-4 py-2 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'text-primary' 
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              <Icon className={`w-6 h-6 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-sm font-semibold ${isActive ? 'text-primary' : ''}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-0 w-10 h-1 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
