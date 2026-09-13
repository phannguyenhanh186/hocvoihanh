import { NavLink, Outlet } from "react-router-dom";

export default function LibraryLayout() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Kho nội dung & Bài tập</h1>
      <p className="text-sm text-ink/55 mb-6">
        Tạo và lưu learning materials + bài tập để tái sử dụng cho nhiều lớp, không cần gắn với lesson nào.
      </p>

      <div className="flex gap-1 border-b border-line mb-6">
        <NavLink
          to="/teacher/library/materials"
          className={({ isActive }) =>
            `px-3 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              isActive ? "border-navy text-navy" : "border-transparent text-ink/55 hover:text-ink"
            }`
          }
        >
          Learning Materials
        </NavLink>
        <NavLink
          to="/teacher/library/exercises"
          className={({ isActive }) =>
            `px-3 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              isActive ? "border-navy text-navy" : "border-transparent text-ink/55 hover:text-ink"
            }`
          }
        >
          Exercise Bank
        </NavLink>
      </div>

      <Outlet />
    </div>
  );
}
