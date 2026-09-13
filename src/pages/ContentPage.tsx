import { useNavigate } from "react-router-dom";
import { Plus, FileText } from "lucide-react";
import { useAppStore } from "../store/useAppStore";

export default function ContentPage() {
  const tests = useAppStore((s) => s.tests);
  const createTest = useAppStore((s) => s.createTest);
  const navigate = useNavigate();

  function handleCreateTest() {
    const test = createTest(`Đề chưa đặt tên`);
    navigate(`/teacher/content/create?testId=${test.id}`);
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Kho bài của tôi</h1>
          <p className="text-sm text-ink/55 mt-1.5">
            Soạn đề và câu hỏi để giao cho lớp học của bạn.
          </p>
        </div>
        <button className="btn-primary shrink-0" onClick={handleCreateTest}>
          <Plus size={16} /> Soạn đề
        </button>
      </div>

      {tests.length === 0 ? (
        <div className="card p-10 text-center text-ink/50 text-sm">
          Chưa có đề nào. Bấm "+ Soạn đề" để bắt đầu tạo đề đầu tiên.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tests.map((t) => (
            <button
              key={t.id}
              onClick={() => navigate(`/teacher/content/create?testId=${t.id}`)}
              className="card p-5 text-left hover:border-navy transition-colors"
            >
              <FileText size={18} className="text-navy mb-3" />
              <h3 className="font-display font-semibold text-sm mb-1">
                {t.title}
              </h3>
              <p className="text-xs text-ink/50">{t.questions.length} câu hỏi</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
