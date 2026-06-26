-- BƯỚC 1: TẠO BẢNG PLAYERS
CREATE TABLE IF NOT EXISTS public.players (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  dupr_id TEXT,
  current_dupr NUMERIC,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- BƯỚC 2: TẠO BẢNG MATCHES
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_by TEXT REFERENCES public.players(id),
  team1_p1 TEXT REFERENCES public.players(id) NOT NULL,
  team1_p2 TEXT REFERENCES public.players(id) NOT NULL,
  team2_p1 TEXT REFERENCES public.players(id) NOT NULL,
  team2_p2 TEXT REFERENCES public.players(id) NOT NULL,
  score_team1 INTEGER NOT NULL,
  score_team2 INTEGER NOT NULL,
  match_type TEXT DEFAULT 'CASUAL' NOT NULL -- Hỗ trợ "Giải đấu" trong tương lai
);

-- BƯỚC 3: BẬT BẢO MẬT ROW LEVEL SECURITY (RLS)
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- BƯỚC 4: THIẾT LẬP QUYỀN (POLICIES) CHO PHÉP ĐỌC/GHI TỪ APP PWA
-- Cho phép ai cũng có thể đọc danh sách người chơi
CREATE POLICY "Allow public read for players" ON public.players FOR SELECT USING (true);
-- Tạm thời cho phép ai cũng có thể đọc/ghi/xoá các trận đấu (Vì bảo mật hệ thống là Trust-based)
CREATE POLICY "Allow public read for matches" ON public.matches FOR SELECT USING (true);
CREATE POLICY "Allow public insert for matches" ON public.matches FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete for matches" ON public.matches FOR DELETE USING (true);

-- BƯỚC 5: KÍCH HOẠT REAL-TIME CHO BẢNG MATCHES
-- Lệnh này giúp các thiết bị nhận dữ liệu mới ngay lập tức mà không cần F5
ALTER PUBLICATION supabase_realtime ADD TABLE public.matches;

-- BƯỚC 6: SEED DỮ LIỆU DANH SÁCH 38 NGƯỜI CHƠI
INSERT INTO public.players (id, full_name, dupr_id, current_dupr, is_admin) VALUES
('p_01', 'Trang Vũ', '6K0XQG', 3.565, true),
('p_02', 'Quân Otis', 'RDELWN', null, false),
('p_03', 'Tòng Nguyễn', '6PDYJG', 3.136, false),
('p_04', 'Đình An', 'GXL9RM', 3.132, false),
('p_05', 'Loan Bui', 'RDLPLZ', 2.815, false),
('p_06', 'Anh Dinh', 'Y4767E', 2.743, false),
('p_07', 'Vinh Le', '0P04O4', 3.122, false),
('p_08', 'Thuỳ Dương', 'ORGD2L', 3.162, false),
('p_09', 'Phúc', 'JY6Z4M', 3.076, false),
('p_10', 'Dũng Nguyễn', '0POQV4', 3.575, false),
('p_11', 'Hồng Minh', '5YDJEV', 3.36, false),
('p_12', 'Ngọc ruby', 'ORGY97', 3.295, false),
('p_13', 'Nguyen Anh Ngoc', '7ZE95N', 3.153, false),
('p_14', 'Tố Quyên', 'ORG5LP', 2.549, false),
('p_15', 'Nhất Huy', '6PV59K', 3.054, false),
('p_16', 'Minh Nguyen', 'Q9459R', 3.269, false),
('p_17', 'Nguyễn Thu Hiền', 'LZEZ0K', 3.156, false),
('p_18', 'Huy Đức', '6P4X90', 3.177, false),
('p_19', 'Vũ Ngọc', '7ZPZQ9', 2.802, false),
('p_20', 'Phạm Vũ', 'EXY45J', 2.897, false),
('p_21', 'Linh Thuỳ', '0PMK7Q', 3.529, false),
('p_22', 'Nghĩa Thịnh', 'EXYENE', 3.075, false),
('p_23', 'Kien Thai', 'V6E7P7', 2.893, false),
('p_24', 'Long Long', '7ZY6Q0', 2.726, false),
('p_25', 'Doanh Nguyễn', '4QNZ56', 2.896, false),
('p_26', 'Doan Khoi Thai', 'RDQEWD', 3.18, false),
('p_27', 'Xu Hà', 'Y4KPW4', 3.171, false),
('p_28', 'Viet Son', 'DDLDYX', 3.226, true),
('p_29', 'Nguyễn Thanh Luân', '57PGWL', 3.121, false),
('p_30', 'Tam Văn', 'R42R2Z', 2.718, false),
('p_31', 'Tú Ngân Hà Hồ', '4EZRM6', 3.082, false),
('p_32', 'Cao Hoa', 'W5XRLM', 3.733, false),
('p_33', 'Cường Nguyễn', 'LP2JLK', 3.6, false),
('p_34', 'Thế Hoàng', '7K6EYN', 2.683, false),
('p_35', 'Phùng Thịnh', 'R4X27N', null, false),
('p_36', 'An Trịnh', null, null, false),
('p_37', 'Bình', null, null, false),
('p_38', 'Trần Tùng', null, null, false)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  dupr_id = EXCLUDED.dupr_id,
  current_dupr = EXCLUDED.current_dupr,
  is_admin = EXCLUDED.is_admin;
