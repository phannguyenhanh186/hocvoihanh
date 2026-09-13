import { NavLink } from "react-router-dom";
import { GraduationCap, Library, Users2, BookMarked } from "lucide-react";

const navItems = [
  { to: "/teacher/classes", label: "Lớp học", icon: GraduationCap },
  { to: "/teacher/content", label: "Kho bài của tôi", icon: Library },
  { to: "/teacher/library", label: "Kho nội dung & Bài tập", icon: BookMarked },
  { to: "/teacher/students", label: "Quản lý học viên", icon: Users2 },
];

export default function TeacherSidebar() {
  return (
    <aside className="w-64 shrink-0 bg-white border-r border-line h-full flex flex-col">
      <div className="px-5 pt-6 pb-4">
        <p className="text-xs font-semibold tracking-wide text-ink/45">
          GIÁO VIÊN
        </p>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                "flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-navy text-white font-semibold"
                  : "text-ink/70 font-medium hover:bg-black/5",
              ].join(" ")
            }
          >
            <Icon size={18} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
