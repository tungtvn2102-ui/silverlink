# SilverLink

**Kết nối — Chăm sóc — Trao cơ hội cho người cao tuổi Việt Nam.**

Nền tảng web 3-trong-1 cho Silver Economy Việt Nam:

1. **Nhà Dưỡng Lão** (`/duong-lao`) — danh mục cơ sở được kiểm chứng, tìm kiếm & so sánh giá/dịch vụ, đặt lịch tham quan, đánh giá từ người dùng thực.
2. **Việc Làm** (`/viec-lam`) — việc làm bán thời gian / linh hoạt / tư vấn cho người cao tuổi từ doanh nghiệp đã kiểm chứng.
3. **Cộng Đồng** (`/cong-dong`) — mạng xã hội nhẹ nhàng: bảng tin, hội nhóm, kết bạn.

Kèm theo: **Cổng doanh nghiệp** (`/doanh-nghiep` — quản lý cơ sở, lịch hẹn, tin tuyển dụng) và **Trang quản trị** (`/admin` — duyệt hồ sơ kiểm chứng, kiểm duyệt nội dung).

## Tech stack

- **Next.js 16** (App Router, TypeScript, Tailwind CSS v4, server actions, `proxy.ts`)
- **Supabase** — Postgres + RLS, Auth (email/password), Storage (ảnh cơ sở, giấy phép)
- **Vercel** — hosting

## Chạy local

```bash
npm install
npm run dev
```

`.env.local` cần:

```
NEXT_PUBLIC_SUPABASE_URL=https://tsypqbsuxqtlfkhtnhdz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable key>
```

## Tài khoản demo (mật khẩu chung: `SilverLink@2026`)

| Vai trò | Email |
|---|---|
| Quản trị viên | `admin@silverlink.vn` |
| Doanh nghiệp (org "Diên Hồng") | `binhan@demo.silverlink.vn` |
| Doanh nghiệp (org "Bình Mỹ", có tin tuyển dụng) | `thienphuc@demo.silverlink.vn` |
| Doanh nghiệp (tuyển dụng "Sống Vui") | `songvui@demo.silverlink.vn` |
| Người cao tuổi | `lan.tran@demo.silverlink.vn` |
| Người thân | `huong.vo@demo.silverlink.vn` |

## Dữ liệu cơ sở dưỡng lão

30 cơ sở trong danh mục là **cơ sở có thật**, tổng hợp từ nguồn công khai
[nhaduonglao.com](https://nhaduonglao.com/) (tên, địa chỉ, khoảng giá, dịch vụ; mỗi mô tả đều ghi rõ nguồn).
Lưu ý:

- Các tài khoản doanh nghiệp demo **không phải** chủ sở hữu thật của các cơ sở này — 4 org demo được đặt theo tên 4 hệ thống lớn (Diên Hồng, Bình Mỹ, Bách Niên Thiên Đức, Vườn Lài) chỉ để demo luồng quản lý; 26 cơ sở còn lại thuộc org "SilverLink Directory (dữ liệu tổng hợp)".
- **Không có đánh giá / xếp hạng giả** — toàn bộ review hư cấu đã bị xóa; cơ sở hiển thị "Mới" cho đến khi có đánh giá thật.
- Trước khi vận hành thật: xác minh trực tiếp với từng cơ sở, bổ sung ảnh thật, và mời chủ cơ sở nhận quyền quản lý hồ sơ.

## Kiến trúc dữ liệu & bảo mật

- Mọi bảng bật **Row Level Security**; vai trò (`senior` / `family` / `business` / `admin`) lưu trên `profiles`.
- **Kiểm chứng (trust engine):** doanh nghiệp & cơ sở luôn khởi tạo ở trạng thái `pending` (trigger ép buộc), chỉ admin đổi được `verification_status`; danh mục công khai chỉ hiển thị cơ sở `verified` + `published`.
- Giấy phép kinh doanh lưu ở bucket **riêng tư** `verification-docs` (chỉ chủ sở hữu + admin đọc qua signed URL).
- Đặt lịch tham quan / hồ sơ ứng tuyển chỉ hiển thị với người gửi và doanh nghiệp nhận.
- Vai trò không thể tự thay đổi (trigger guard); signup không thể tự nhận `admin`.

## Việc cần làm tiếp (fast-follow)

- [ ] Bật **Leaked Password Protection** trong Supabase Auth settings (dashboard).
- [ ] Cấu hình SMTP riêng (hoặc Zalo ZNS) cho email xác nhận & thông báo trạng thái lịch hẹn.
- [ ] Google OAuth (cần tạo OAuth credentials rồi bật trong Supabase Auth).
- [ ] Phone OTP đăng nhập cho người cao tuổi (cần nhà cung cấp SMS).
- [ ] Bổ sung ảnh thật của từng cơ sở (hiện danh mục không dùng ảnh giả).

## Tạo admin mới

```sql
update public.profiles set role = 'admin' where id = '<user-uuid>';
-- chạy bằng quyền service role / SQL editor (trigger chặn user tự đổi role)
```
