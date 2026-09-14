import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { HOMEWORK_CONTENT_KIND_LABELS } from "../../types";
import { getSnapshotPreview } from "../../lib/contentPreview";
import ContentPreviewBody from "../../components/homework/ContentPreviewBody";

export default function StudentHomeworkDetailPage() {
  const { classId, studentId, homeworkId } = useParams();
  const navigate = useNavigate();
  const pkg = useAppStore((s) => s.homeworkPackages.find((h) => h.id === homeworkId));
  const [openId, setOpenId] = useState<string | null>(null);

  if (!pkg) {
    return <div className="card p-10 text-center text-ink/50 text-sm">Không tìm thấy bài tập.</div>;
  }

  return (
    <div>
      <button
        className="flex items-center gap-1.5 text-sm text-ink/60 hover:text-ink transition-colors mb-4"
        onClick={() => navigate(`/student/${classId}/${studentId}`)}
      >
        <ArrowLeft size={16} /> Danh sách bài tập
      </button>

      <h1 className="text-xl font-display font-semibold mb-1">{pkg.title}</h1>
      <p className="text-sm text-ink/50 mb-5">
        Giao {new Date(pkg.assignedDate).toLocaleDateString("vi-VN")}
        {pkg.dueDate && ` · Hạn nộp ${new Date(pkg.dueDate).toLocaleDateString("vi-VN")}`}
      </p>

      <div className="space-y-1.5">
        {pkg.items
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((item, i) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className="border border-line rounded-md overflow-hidden bg-white">
                <button
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-left hover:bg-paper"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                >
                  {isOpen ? <ChevronDown size={15} className="text-ink/40" /> : <ChevronRight size={15} className="text-ink/40" />}
                  <span className="text-ink/40 font-medium">{i + 1}.</span>
                  <span className="font-medium flex-1">{item.title}</span>
                  <span className="text-xs font-medium text-navy bg-navy-50 px-1.5 py-0.5 rounded-full">
                    {HOMEWORK_CONTENT_KIND_LABELS[item.sourceKind]}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 border-t border-line">
                    <ContentPreviewBody data={getSnapshotPreview(item)} />
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
