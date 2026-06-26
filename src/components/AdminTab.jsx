import { Settings, Lock, Download, Users } from 'lucide-react';
import { PLAYERS, getPlayerById } from '../data/players';
import Avatar from './Avatar';
import dayjs from 'dayjs';

export default function AdminTab({ currentPlayer, matches, dbPlayers = [] }) {
  const isAdmin = currentPlayer?.is_admin === true;

  const handleExportCSV = () => {
    if (!matches || matches.length === 0) {
      alert("Không có trận đấu nào để xuất");
      return;
    }

    const headers = [
      "Date",
      "Match Format",
      "Player 1 DUPR ID",
      "Player 1 Name",
      "Player 2 DUPR ID",
      "Player 2 Name",
      "Player 3 DUPR ID",
      "Player 3 Name",
      "Player 4 DUPR ID",
      "Player 4 Name",
      "Team 1 Score",
      "Team 2 Score"
    ];

    const getPlayer = (id) => dbPlayers.find(p => p.id === id) || { full_name: '', dupr_id: '' };

    const rows = matches.map(match => {
      const t1p1 = getPlayer(match.team1_p1);
      const t1p2 = getPlayer(match.team1_p2);
      const t2p1 = getPlayer(match.team2_p1);
      const t2p2 = getPlayer(match.team2_p2);

      const matchDate = dayjs(match.created_at).format('MM/DD/YYYY');

      return [
        matchDate,
        "Doubles",
        t1p1.dupr_id || '',
        t1p1.full_name || '',
        t1p2.dupr_id || '',
        t1p2.full_name || '',
        t2p1.dupr_id || '',
        t2p1.full_name || '',
        t2p2.dupr_id || '',
        t2p2.full_name || '',
        match.score_team1,
        match.score_team2
      ].map(val => `"${val}"`).join(',');
    });

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + headers.join(',') + "\n" + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `dupr_export_picksang_${dayjs().format('YYYYMMDD')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="pb-24 px-4 pt-4">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-6 h-6 text-text-secondary" />
        <h2 className="text-xl font-extrabold text-text-primary">Quản lý</h2>
      </div>

      {!isAdmin && (
        <div className="glass-card rounded-2xl p-6 text-center mb-6">
          <Lock className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <p className="text-base text-text-muted font-medium">
            Chỉ Admin mới có thể thao tác tại đây
          </p>
          <p className="text-sm text-text-muted/60 mt-1">
            Liên hệ Trang Vũ, Vinh Le hoặc Viet Son để được cấp quyền
          </p>
        </div>
      )}

      {/* Danh sách thành viên */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-6 h-6 text-text-secondary" />
          <h3 className="text-lg font-bold text-text-primary">Danh sách thành viên ({dbPlayers.length})</h3>
        </div>
        <div className="space-y-2">
          {dbPlayers.map(player => (
            <div
              key={player.id}
              className="glass-card rounded-xl p-3.5 flex items-center gap-3"
            >
              <Avatar player={player} size={40} />
              <div className="flex-1 min-w-0">
                <div className="text-base font-semibold text-text-primary truncate">
                  {player.full_name}
                </div>
                <div className="text-sm text-text-muted">
                  {player.dupr_id ? `DUPR: ${player.current_dupr || 'NR'}` : 'Chưa có DUPR ID'}
                  {player.is_admin && ' · 👑 Admin'}
                </div>
              </div>
              {player.current_dupr && (
                <span className="text-base font-bold text-accent tabular-nums">
                  {player.current_dupr}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Nút xuất CSV */}
      <button
        disabled={!isAdmin}
        onClick={handleExportCSV}
        className={`w-full py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-2 transition-all ${
          isAdmin
            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30 active:scale-[0.98]'
            : 'bg-surface-elevated text-text-muted cursor-not-allowed'
        }`}
      >
        <Download className="w-6 h-6" />
        TẢI FILE CSV CHUẨN DUPR
      </button>
    </div>
  );
}
