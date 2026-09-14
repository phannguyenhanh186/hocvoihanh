# Thiết lập Firebase cho app này

## 1. Firestore Rules

Vào Firebase Console → project **hocvoihanh-1806** → sidebar trái → **Build → Firestore Database** →
tab **Rules**, thay toàn bộ nội dung bằng:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /app_state/shared {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

Bấm **Publish**.

## 2. Storage Rules

Sidebar trái → **Build → Storage** → tab **Rules**, thay bằng:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /audio/{fileName} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

Bấm **Publish**.

## ⚠️ Đánh đổi về bảo mật cần biết

App này **chưa có tài khoản đăng nhập cho giáo viên**, nên rules ở trên phải cho phép
**bất kỳ ai** đọc/ghi vào document `app_state/shared` và thư mục `audio/`. Nghĩa là:

- Bất kỳ ai biết địa chỉ web (không cần biết cấu hình Firebase — cấu hình đó vốn công khai
  trong code frontend) đều có thể **sửa hoặc xoá** toàn bộ dữ liệu (lớp học, flashcard,
  bài tập, BTVN...) thông qua Firestore, không chỉ qua giao diện app.
- Đây là đánh đổi có chủ đích để đạt được mục tiêu trước mắt: **học sinh xem được bài mà
  không cần tài khoản**. Với một app dùng nội bộ, ít người biết link, rủi ro này thấp — nhưng
  không an toàn nếu link bị lộ rộng rãi.

**Hướng khắc phục về sau** (khi cần): thêm Firebase Authentication cho giáo viên (email +
mật khẩu), sửa rules thành `allow write: if request.auth != null` (chỉ giáo viên đã đăng
nhập mới ghi được, ai cũng đọc được để học sinh xem bài). Đây là bước làm tiếp theo hợp lý
nếu app được dùng rộng hơn.

## 3. Vì sao dữ liệu giờ đã dùng chung được

- Toàn bộ dữ liệu (trừ file MP3) được lưu trong **một document Firestore** duy nhất:
  `app_state/shared`. Giáo viên sửa gì, ghi vào đó; học sinh mở trang `/student/...` sẽ đọc
  từ đúng document đó — nên thấy được bài mới nhất mỗi lần họ **tải lại trang** (chưa phải
  cập nhật theo thời gian thực, cần F5 để thấy thay đổi mới).
- File MP3 được upload thẳng lên **Firebase Storage** (không nhúng vào Firestore), vì
  Firestore giới hạn mỗi document ~1MB — nhúng file âm thanh vào đó sẽ sớm vượt giới hạn.

## 4. Đường dẫn cho học sinh

Trong trang chi tiết lớp học (`/teacher/classes/:classId`), giáo viên bấm nút
**"Link cho học viên"** để copy link dạng `/student/<classId>` gửi cho học sinh. Học sinh vào
link đó, chọn tên mình, xem danh sách BTVN — không cần tài khoản.
