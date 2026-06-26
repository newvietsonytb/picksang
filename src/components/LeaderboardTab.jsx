import { useMemo } from 'react';
import { Trophy } from 'lucide-react';
import { getPlayerById } from '../data/players';
import Avatar from './Avatar';

export default function LeaderboardTab({ matches }) {
  const leaderboard = useMemo(() => {
    const stats = {};

    matches.filter(m => m.match_type === 'CASUAL').forEach(match => {
      const team1Wins = match.score_team1 > match.score_team2;
      const winners = team1Wins ? [match.team1_p1, match.team1_p2] : [match.team2_p1, match.team2_p2];
      const losers = team1Wins ? [match.team2_p1, match.team2_p2] : [match.team1_p1, match.team1_p2];

      winners.forEach(id => {
        if (!stats[id]) stats[id] = { wins: 0, losses: 0, matches: 0 };
        stats[id].wins++;
        stats[id].matches++;
      });

      losers.forEach(id => {
        if (!stats[id]) stats[id] = { wins: 0, losses: 0, matches: 0 };
        stats[id].losses++;
        stats[id].matches++;
      });
    });

    return Object.entries(stats)
      .map(([id, s]) => ({
        player: getPlayerById(id),
        ...s,
        winRate: s.matches > 0 ? Math.round((s.wins / s.matches) * 100) : 0,
      }))
      .filter(s => s.player)
      .sort((a, b) => b.winRate - a.winRate || b.wins - a.wins);
  }, [matches]);

  // Tìm badges
  const badges = useMemo(() => {
    const casualMatches = matches.filter(m => m.match_type === 'CASUAL')
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    // 🔥 Đang cháy: thắng >= 3 trận liên tiếp
    const onFire = new Set();
    const playerLastMatches = {};
    
    casualMatches.forEach(match => {
      const team1Wins = match.score_team1 > match.score_team2;
      [match.team1_p1, match.team1_p2, match.team2_p1, match.team2_p2].forEach(id => {
        if (!playerLastMatches[id]) playerLastMatches[id] = [];
        const isWinner = team1Wins 
          ? (id === match.team1_p1 || id === match.team1_p2)
          : (id === match.team2_p1 || id === match.team2_p2);
        playerLastMatches[id].push(isWinner ? 'W' : 'L');
      });
    });

    Object.entries(playerLastMatches).forEach(([id, results]) => {
      const lastThree = results.slice(0, 3);
      if (lastThree.length >= 3 && lastThree.every(r => r === 'W')) {
        onFire.add(id);
      }
    });

    // 🛡️ Sắt Thép: số trận nhiều nhất
    let ironMan = null;
    let maxMatches = 0;
    leaderboard.forEach(entry => {
      if (entry.matches > maxMatches) {
        maxMatches = entry.matches;
        ironMan = entry.player?.id;
      }
    });

    return { onFire, ironMan };
  }, [matches, leaderboard]);

  const getRankEmoji = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}`;
  };

  return (
    <div className="pb-24 px-4 pt-4">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-6 h-6 text-accent" />
        <h2 className="text-xl font-extrabold text-text-primary">Bảng xếp hạng</h2>
      </div>

      {leaderboard.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🏆</div>
          <p className="text-text-muted text-base">Chưa có dữ liệu. Hãy nhập trận đầu tiên!</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {leaderboard.map((entry, index) => (
            <div
              key={entry.player.id}
              className={`glass-card rounded-xl p-3.5 flex items-center gap-3 ${
                index < 3 ? 'border border-accent/20' : ''
              }`}
            >
              <div className="w-9 text-center text-lg font-bold">
                {getRankEmoji(index)}
              </div>
              <Avatar player={entry.player} size={44} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-bold text-text-primary truncate">
                    {entry.player.full_name}
                  </span>
                  {badges.onFire.has(entry.player.id) && (
                    <span className="text-base" title="Đang cháy! Thắng 3+ trận liên tiếp">🔥</span>
                  )}
                  {badges.ironMan === entry.player.id && (
                    <span className="text-base" title="Sắt Thép - Nhiều trận nhất">🛡️</span>
                  )}
                </div>
                <div className="text-sm text-text-muted">
                  {entry.matches} trận · {entry.wins}T - {entry.losses}B
                </div>
              </div>
              <div className={`text-2xl font-extrabold tabular-nums ${
                entry.winRate >= 60 ? 'text-win' : entry.winRate >= 40 ? 'text-accent' : 'text-lose'
              }`}>
                {entry.winRate}%
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
