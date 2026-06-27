export const PLAYERS = [
  { id: 'p_01', full_name: 'Trang Vũ', dupr_id: '6K0XQG', current_dupr: 3.565, is_admin: true },
  { id: 'p_02', full_name: 'Quân Otis', dupr_id: 'RDELWN', current_dupr: null, is_admin: false },
  { id: 'p_03', full_name: 'Tòng Nguyễn', dupr_id: '6PDYJG', current_dupr: 3.136, is_admin: false },
  { id: 'p_04', full_name: 'Đình An', dupr_id: 'GXL9RM', current_dupr: 3.132, is_admin: false },
  { id: 'p_05', full_name: 'Loan Bui', dupr_id: 'RDLPLZ', current_dupr: 2.815, is_admin: false },
  { id: 'p_06', full_name: 'Anh Dinh', dupr_id: 'Y4767E', current_dupr: 2.743, is_admin: false },
  { id: 'p_07', full_name: 'Vinh Le', dupr_id: '0P04O4', current_dupr: 3.122, is_admin: false },
  { id: 'p_08', full_name: 'Thuỳ Dương', dupr_id: 'ORGD2L', current_dupr: 3.162, is_admin: false },
  { id: 'p_09', full_name: 'Phúc', dupr_id: 'JY6Z4M', current_dupr: 3.076, is_admin: false },
  { id: 'p_10', full_name: 'Dũng Nguyễn', dupr_id: '0POQV4', current_dupr: 3.575, is_admin: false },
  { id: 'p_11', full_name: 'Hồng Minh', dupr_id: '5YDJEV', current_dupr: 3.36, is_admin: false },
  { id: 'p_12', full_name: 'Ngọc ruby', dupr_id: 'ORGY97', current_dupr: 3.295, is_admin: false },
  { id: 'p_13', full_name: 'Nguyen Anh Ngoc', dupr_id: '7ZE95N', current_dupr: 3.153, is_admin: false },
  { id: 'p_14', full_name: 'Tố Quyên', dupr_id: 'ORG5LP', current_dupr: 2.549, is_admin: false },
  { id: 'p_15', full_name: 'Nhất Huy', dupr_id: '6PV59K', current_dupr: 3.054, is_admin: false },
  { id: 'p_16', full_name: 'Minh Nguyen', dupr_id: 'Q9459R', current_dupr: 3.269, is_admin: false },
  { id: 'p_17', full_name: 'Nguyễn Thu Hiền', dupr_id: 'LZEZ0K', current_dupr: 3.156, is_admin: false },
  { id: 'p_18', full_name: 'Huy Đức', dupr_id: '6P4X90', current_dupr: 3.177, is_admin: false },
  { id: 'p_19', full_name: 'Vũ Ngọc', dupr_id: '7ZPZQ9', current_dupr: 2.802, is_admin: false },
  { id: 'p_20', full_name: 'Phạm Vũ', dupr_id: 'EXY45J', current_dupr: 2.897, is_admin: false },
  { id: 'p_21', full_name: 'Linh Thuỳ', dupr_id: '0PMK7Q', current_dupr: 3.529, is_admin: false },
  { id: 'p_22', full_name: 'Nghĩa Thịnh', dupr_id: 'EXYENE', current_dupr: 3.075, is_admin: false },
  { id: 'p_23', full_name: 'Kien Thai', dupr_id: 'V6E7P7', current_dupr: 2.893, is_admin: false },
  { id: 'p_24', full_name: 'Long Long', dupr_id: '7ZY6Q0', current_dupr: 2.726, is_admin: false },
  { id: 'p_25', full_name: 'Doanh Nguyễn', dupr_id: '4QNZ56', current_dupr: 2.896, is_admin: false },
  { id: 'p_26', full_name: 'Doan Khoi Thai', dupr_id: 'RDQEWD', current_dupr: 3.18, is_admin: false },
  { id: 'p_27', full_name: 'Xu Hà', dupr_id: 'Y4KPW4', current_dupr: 3.171, is_admin: false },
  { id: 'p_28', full_name: 'Viet Son', dupr_id: 'DDLDYX', current_dupr: 3.226, is_admin: false },
  { id: 'p_29', full_name: 'Nguyễn Thanh Luân', dupr_id: '57PGWL', current_dupr: 3.121, is_admin: false },
  { id: 'p_30', full_name: 'Tam Văn', dupr_id: 'R42R2Z', current_dupr: 2.718, is_admin: false },
  { id: 'p_31', full_name: 'Tú Ngân Hà Hồ', dupr_id: '4EZRM6', current_dupr: 3.082, is_admin: false },
  { id: 'p_32', full_name: 'Cao Hoa', dupr_id: 'W5XRLM', current_dupr: 3.733, is_admin: false },
  { id: 'p_33', full_name: 'Cường Nguyễn', dupr_id: 'LP2JLK', current_dupr: 3.6, is_admin: false },
  { id: 'p_34', full_name: 'Thế Hoàng', dupr_id: '7K6EYN', current_dupr: 2.683, is_admin: false },
  { id: 'p_35', full_name: 'Phùng Thịnh', dupr_id: 'R4X27N', current_dupr: null, is_admin: false },
  { id: 'p_36', full_name: 'An Trịnh', dupr_id: null, current_dupr: null, is_admin: false },
  { id: 'p_37', full_name: 'Bình', dupr_id: null, current_dupr: null, is_admin: false },
  { id: 'p_38', full_name: 'Trần Tùng', dupr_id: null, current_dupr: null, is_admin: false },
];

export function removeVietnameseTones(str) {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

export function searchMatch(playerName, query) {
  if (!query.trim()) return true;
  const normalizedName = removeVietnameseTones(playerName);
  const normalizedQuery = removeVietnameseTones(query);
  return normalizedName.includes(normalizedQuery);
}

export function getPlayerById(id) {
  return PLAYERS.find(p => p.id === id) || null;
}

export function getPlayerInitials(fullName) {
  if (!fullName) return '??';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

const AVATAR_COLORS = [
  '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#ef4444', '#f97316',
  '#f59e0b', '#eab308', '#84cc16', '#22c55e',
  '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6',
];

export function getAvatarColor(playerId) {
  const num = parseInt(playerId.replace('p_', ''), 10) || 0;
  return AVATAR_COLORS[num % AVATAR_COLORS.length];
}
