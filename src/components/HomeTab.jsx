import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import MatchForm from './MatchForm';
import MatchCard from './MatchCard';
import PickleballIcon from './PickleballIcon';
import { filterByPeriod, getDateKey, formatDate } from '../utils/dateUtils';

const DATE_FILTERS = [
  { id: 'today', label: 'Hôm nay' },
  { id: 'week', label: 'Tuần này' },
  { id: 'month', label: 'Tháng này' },
];

export default function HomeTab({ 
  currentPlayerId, 
  currentPlayer, 
  matches, 
  isLoading,
  onSaveMatch, 
  onDeleteMatch 
}) {
  const [showForm, setShowForm] = useState(false);
  const [dateFilter, setDateFilter] = useState('today');

  const filteredMatches = useMemo(() => {
    const filtered = filterByPeriod(matches, dateFilter);
    return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [matches, dateFilter]);

  // Group matches by date for date separators
  const groupedMatches = useMemo(() => {
    if (dateFilter === 'today') return [{ key: 'today', label: null, matches: filteredMatches }];
    
    const groups = [];
    let currentKey = null;
    
    filteredMatches.forEach(match => {
      const key = getDateKey(match.created_at);
      if (key !== currentKey) {
        currentKey = key;
        groups.push({ key, label: formatDate(match.created_at), matches: [] });
      }
      groups[groups.length - 1].matches.push(match);
    });
    
    return groups;
  }, [filteredMatches, dateFilter]);

  const handleSave = (match) => {
    onSaveMatch(match);
    setShowForm(false);
  };

  return (
    <div className="pb-24">
      {/* Nút thêm trận */}
      <div className="px-4 pt-4 pb-3">
        <button
          onClick={() => setShowForm(true)}
          id="btn-add-match"
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-emerald-500 text-white font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/30 pulse-glow active:scale-[0.98] transition-transform"
        >
          <Plus className="w-6 h-6" strokeWidth={3} />
          NHẬP TRẬN MỚI
        </button>
      </div>

      {/* Bộ lọc ngày */}
      <div className="px-4 pb-4">
        <div className="flex gap-1.5 p-1 bg-surface-card rounded-xl">
          {DATE_FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setDateFilter(f.id)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                dateFilter === f.id
                  ? 'bg-primary text-white shadow-md shadow-primary/30'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Danh sách trận đấu */}
      <div className="px-4 space-y-3 match-feed">
        {groupedMatches.map(group => (
          <div key={group.key}>
            {/* Phân cách ngày */}
            {group.label && (
              <div className="date-separator py-3">
                {group.label}
              </div>
            )}
            
            <div className="space-y-3">
              {group.matches.map(match => (
                <MatchCard
                  key={match.id}
                  match={match}
                  currentPlayer={currentPlayer}
                  onDelete={onDeleteMatch}
                />
              ))}
            </div>
          </div>
        ))}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-text-muted text-sm font-medium">Đang tải dữ liệu...</p>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center">
            <PickleballIcon className="w-16 h-16 text-text-muted/50 mb-4" />
            <p className="text-text-muted text-base font-medium">Chưa có trận nào</p>
            <p className="text-text-muted/60 text-sm mt-1">Nhấn nút phía trên để nhập trận đầu tiên!</p>
          </div>
        ) : null}
      </div>

      {/* Form nhập trận */}
      {showForm && (
        <MatchForm
          currentPlayerId={currentPlayerId}
          matches={matches}
          onSave={handleSave}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
