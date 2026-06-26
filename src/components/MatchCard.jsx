import { Trash2 } from 'lucide-react';
import { getPlayerById } from '../data/players';
import Avatar from './Avatar';
import { formatTime } from '../utils/dateUtils';

export default function MatchCard({ match, currentPlayer, onDelete }) {
  const t1p1 = getPlayerById(match.team1_p1);
  const t1p2 = getPlayerById(match.team1_p2);
  const t2p1 = getPlayerById(match.team2_p1);
  const t2p2 = getPlayerById(match.team2_p2);
  const createdBy = getPlayerById(match.created_by);

  const team1Wins = match.score_team1 > match.score_team2;

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* Header: Giờ */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <span className="text-sm font-medium text-text-muted">
          {formatTime(match.created_at)}
        </span>
        {currentPlayer?.is_admin && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onDelete?.(match.id)}
              className="p-1.5 rounded-lg hover:bg-danger/10 transition-colors group"
            >
              <Trash2 className="w-5 h-5 text-text-muted group-hover:text-danger transition-colors" />
            </button>
          </div>
        )}
      </div>

      {/* Body: Sports Ticker */}
      <div className="flex items-center px-4 pb-2 gap-3">
        {/* Đội 1 */}
        <div className={`flex-1 flex flex-col items-end gap-1.5 min-w-0 ${team1Wins ? '' : 'opacity-60'}`}>
          <div className="flex items-center gap-1.5 w-full justify-end">
            <span className={`text-sm md:text-base truncate ${team1Wins ? 'font-bold text-text-primary' : 'text-text-secondary'}`}>
              {t1p1?.full_name}
            </span>
            <Avatar player={t1p1} size={28} />
          </div>
          <div className="flex items-center gap-1.5 w-full justify-end">
            <span className={`text-sm md:text-base truncate ${team1Wins ? 'font-bold text-text-primary' : 'text-text-secondary'}`}>
              {t1p2?.full_name}
            </span>
            <Avatar player={t1p2} size={28} />
          </div>
        </div>

        {/* Tỉ số */}
        <div className="flex items-center gap-1.5 shrink-0 px-1 md:px-2">
          <span className={`text-3xl md:text-4xl font-extrabold tabular-nums ${team1Wins ? 'text-win win-glow' : 'text-lose'}`}>
            {match.score_team1}
          </span>
          <span className="text-lg font-bold text-text-muted">-</span>
          <span className={`text-3xl md:text-4xl font-extrabold tabular-nums ${!team1Wins ? 'text-win win-glow' : 'text-lose'}`}>
            {match.score_team2}
          </span>
        </div>

        {/* Đội 2 */}
        <div className={`flex-1 flex flex-col items-start gap-1.5 min-w-0 ${!team1Wins ? '' : 'opacity-60'}`}>
          <div className="flex items-center gap-1.5 w-full">
            <Avatar player={t2p1} size={28} />
            <span className={`text-sm md:text-base truncate ${!team1Wins ? 'font-bold text-text-primary' : 'text-text-secondary'}`}>
              {t2p1?.full_name}
            </span>
          </div>
          <div className="flex items-center gap-1.5 w-full">
            <Avatar player={t2p2} size={28} />
            <span className={`text-sm md:text-base truncate ${!team1Wins ? 'font-bold text-text-primary' : 'text-text-secondary'}`}>
              {t2p2?.full_name}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-border/50 bg-surface-card/30">
        <span className="text-sm text-text-muted">
          Nhập bởi: {createdBy?.full_name || 'Không rõ'} lúc {formatTime(match.created_at)}
        </span>
      </div>
    </div>
  );
}
