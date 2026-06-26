export default function PickleballIcon({ className = "w-6 h-6" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Cán vợt */}
      <path d="M12 16v6" />
      <path d="M10 20h4" />
      {/* Mặt vợt (Pickleball paddle thường có hình chữ nhật bo tròn) */}
      <rect x="7" y="2" width="10" height="14" rx="4" />
      
      {/* Quả bóng Pickleball (có các lỗ đặc trưng) */}
      <circle cx="18" cy="16" r="3" />
      <circle cx="17" cy="15" r="0.5" fill="currentColor" />
      <circle cx="19" cy="16" r="0.5" fill="currentColor" />
      <circle cx="18" cy="17.5" r="0.5" fill="currentColor" />
    </svg>
  );
}
