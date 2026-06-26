import { getPlayerInitials, getAvatarColor } from '../data/players';

export default function Avatar({ player, size = 40, className = '' }) {
  if (!player) return null;
  const initials = getPlayerInitials(player.full_name);
  const bgColor = getAvatarColor(player.id);
  
  return (
    <div
      className={`flex items-center justify-center rounded-full font-bold text-white shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        backgroundColor: bgColor,
        boxShadow: `0 2px 8px ${bgColor}40`,
      }}
    >
      {initials}
    </div>
  );
}
