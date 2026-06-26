import { useState, useMemo, useCallback } from 'react';
import { X, Minus, Plus, Save, Loader2, AlertTriangle } from 'lucide-react';
import PlayerSlot from './PlayerSlot';
import { getPlayerById } from '../data/players';
import { now } from '../utils/dateUtils';

export default function MatchForm({ currentPlayerId, matches, onSave, onClose }) {
  const [team1P1, setTeam1P1] = useState(currentPlayerId);
  const [team1P2, setTeam1P2] = useState(null);
  const [team2P1, setTeam2P1] = useState(null);
  const [team2P2, setTeam2P2] = useState(null);
  const [scoreT1, setScoreT1] = useState(0);
  const [scoreT2, setScoreT2] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getExcludeIds = useCallback((excludeSlot) => {
    const slots = { team1P1, team1P2, team2P1, team2P2 };
    return Object.entries(slots)
      .filter(([key, val]) => key !== excludeSlot && val !== null)
      .map(([, val]) => val);
  }, [team1P1, team1P2, team2P1, team2P2]);

  const handleSlotSelect = useCallback((slot, playerId) => {
    const setters = { team1P1: setTeam1P1, team1P2: setTeam1P2, team2P1: setTeam2P1, team2P2: setTeam2P2 };
    const values = { team1P1, team1P2, team2P1, team2P2 };
    
    Object.entries(values).forEach(([key, val]) => {
      if (key !== slot && val === playerId) {
        setters[key](null);
      }
    });
    
    setters[slot](playerId);
  }, [team1P1, team1P2, team2P1, team2P2]);

  const validation = useMemo(() => {
    const allSlots = [team1P1, team1P2, team2P1, team2P2];
    const allFilled = allSlots.every(s => s !== null);
    const allUnique = new Set(allSlots.filter(Boolean)).size === allSlots.filter(Boolean).length;

    const errors = [];

    if (!allFilled || !allUnique) {
      errors.push('Chọn đủ 4 người chơi khác nhau');
    }

    if (scoreT1 + scoreT2 === 0) {
      errors.push('Điểm phải lớn hơn 0');
    }

    if (scoreT1 === scoreT2 && scoreT1 > 0) {
      errors.push('Pickleball không có hòa');
    }

    if (allFilled && allUnique) {
      const playerSet = new Set(allSlots);
      const fifteenMinAgo = now().subtract(15, 'minute');
      
      const recentDuplicate = matches.find(m => {
        const matchPlayers = new Set([m.team1_p1, m.team1_p2, m.team2_p1, m.team2_p2]);
        if (matchPlayers.size !== 4) return false;
        const isSamePlayers = [...playerSet].every(p => matchPlayers.has(p));
        const isRecent = new Date(m.created_at) > fifteenMinAgo.toDate();
        return isSamePlayers && isRecent;
      });

      if (recentDuplicate) {
        const minsAgo = Math.round(now().diff(recentDuplicate.created_at, 'minute'));
        errors.push(`⚠️ 4 người này vừa lưu trận ${minsAgo} phút trước. Vui lòng chờ 15 phút nếu là trận tái đấu.`);
      }
    }

    return { isValid: errors.length === 0, errors };
  }, [team1P1, team1P2, team2P1, team2P2, scoreT1, scoreT2, matches]);

  const handleSave = async () => {
    if (!validation.isValid || isSubmitting) return;
    setIsSubmitting(true);

    await new Promise(r => setTimeout(r, 300));

    const match = {
      id: crypto.randomUUID(),
      created_at: now().toISOString(),
      created_by: currentPlayerId,
      team1_p1: team1P1,
      team1_p2: team1P2,
      team2_p1: team2P1,
      team2_p2: team2P2,
      score_team1: scoreT1,
      score_team2: scoreT2,
      match_type: 'CASUAL',
    };

    onSave(match);
    setIsSubmitting(false);
  };

  const ScoreStepper = ({ value, onChange, label }) => (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className="stepper-btn w-9 h-9 rounded-full bg-surface-elevated flex items-center justify-center border border-border hover:border-danger transition-colors shrink-0"
        >
          <Minus className="w-5 h-5 text-text-secondary" />
        </button>
        <span key={value} className={`text-4xl font-extrabold min-w-[2ch] text-center tabular-nums ${value > 0 ? 'text-text-primary score-pop' : 'text-text-muted'}`}>
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(99, value + 1))}
          className="stepper-btn w-9 h-9 rounded-full bg-surface-elevated flex items-center justify-center border border-border hover:border-primary transition-colors shrink-0"
        >
          <Plus className="w-5 h-5 text-text-secondary" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overlay-bg fade-in" onClick={onClose}>
      <div
        className="absolute inset-0 bg-surface flex flex-col slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-border shrink-0" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <h2 className="text-lg font-bold text-text-primary">Nhập trận mới</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-card transition-colors">
            <X className="w-6 h-6 text-text-secondary" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-5">
          {/* Đội 1 - Đội của bạn */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              <h3 className="text-base font-bold text-primary">Đội của bạn</h3>
            </div>
            <div className="space-y-2.5">
              <PlayerSlot
                label="Người chơi 1 (Bạn)"
                selectedPlayerId={team1P1}
                excludeIds={getExcludeIds('team1P1')}
                onSelect={(id) => handleSlotSelect('team1P1', id)}
                onClear={() => setTeam1P1(null)}
              />
              <PlayerSlot
                label="Người chơi 2"
                selectedPlayerId={team1P2}
                excludeIds={getExcludeIds('team1P2')}
                onSelect={(id) => handleSlotSelect('team1P2', id)}
                onClear={() => setTeam1P2(null)}
              />
            </div>
          </div>

          {/* Đội 2 - Đối thủ */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-accent" />
              <h3 className="text-base font-bold text-accent">Đối thủ</h3>
            </div>
            <div className="space-y-2.5">
              <PlayerSlot
                label="Đối thủ 1"
                selectedPlayerId={team2P1}
                excludeIds={getExcludeIds('team2P1')}
                onSelect={(id) => handleSlotSelect('team2P1', id)}
                onClear={() => setTeam2P1(null)}
              />
              <PlayerSlot
                label="Đối thủ 2"
                selectedPlayerId={team2P2}
                excludeIds={getExcludeIds('team2P2')}
                onSelect={(id) => handleSlotSelect('team2P2', id)}
                onClear={() => setTeam2P2(null)}
              />
            </div>
          </div>

          {/* Phần điểm */}
          <div className="glass-card rounded-2xl p-4 mb-6">
            <h3 className="text-base font-bold text-text-primary text-center mb-4">Tỉ số</h3>
            <div className="flex items-start justify-center gap-2 md:gap-6">
              <ScoreStepper value={scoreT1} onChange={setScoreT1} label="Đội bạn" />
              <div className="pt-6 text-2xl md:text-3xl font-bold text-text-muted">—</div>
              <ScoreStepper value={scoreT2} onChange={setScoreT2} label="Đối thủ" />
            </div>
          </div>
        </div>

        {/* Footer - Nút Lưu */}
        <div className="shrink-0 px-4 pb-5 pt-3 border-t border-border bg-surface" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 20px)' }}>
          {!validation.isValid && (
            <div className="mb-4 bg-danger/10 border border-danger/20 rounded-xl p-3 space-y-1.5">
              {validation.errors.map((err, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-danger font-medium">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{err}</span>
                </div>
              ))}
            </div>
          )}
          
          <button
            onClick={handleSave}
            disabled={!validation.isValid || isSubmitting}
            className={`w-full py-4 rounded-2xl text-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
              validation.isValid && !isSubmitting
                ? 'bg-gradient-to-r from-primary to-emerald-500 text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 active:scale-[0.98]'
                : 'bg-surface-elevated text-text-muted cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <Save className="w-6 h-6" />
                XÁC NHẬN LƯU
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
