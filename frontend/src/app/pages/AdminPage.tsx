import { ArrowLeft, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient, useActivityCategories } from "../../api";
import { ACTIVITY_ICON_KEYS, getActivityIconByKey } from "../shared/activityIcons";

const ACCENT = "#F3A537";
const ADMIN_BYPASS = false;
const ADMIN_TOKEN_STORAGE_KEY = "bd.admin.token";
const FIXED_CATEGORIES = [
  { key: "STUDY", label: "Study", iconKey: "graduation-cap" },
  { key: "RESEARCH_PROJECT", label: "Research & Project", iconKey: "microscope" },
  { key: "SEMINAR_NETWORKING", label: "Seminar & Networking", iconKey: "users" },
];

export default function AdminPage() {
  const navigate = useNavigate();

  const [adminAuthed, setAdminAuthed] = useState(ADMIN_BYPASS);
  const [adminTab, setAdminTab] = useState("Activity");

  const [adminPassword, setAdminPassword] = useState("");
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
  });

  useEffect(() => {
    apiClient.setAccessToken(adminToken);
    if (typeof window === "undefined") return;
    if (adminToken) {
      localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, adminToken);
    } else {
      localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
    }
  }, [adminToken]);

  useEffect(() => {
    if (adminToken && !adminAuthed) {
      setAdminAuthed(true);
    }
  }, [adminToken, adminAuthed]);

  const AdminTabs = useMemo(
    () => [
      { key: "Activity", label: "Activity" },
      { key: "Recruitment", label: "Recruitment" },
      { key: "FAQ", label: "FAQ" },
    ],
    []
  );

  const AdminShell = ({ children }: { children: ReactNode }) => (
    <section id="admin" className="min-h-screen pt-24 pb-16 px-6 relative" style={{ backgroundColor: "#000" }}>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .focus-accent:focus-visible { outline: 2px solid ${ACCENT}; outline-offset: 2px; }
      `}</style>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex items-center justify-between gap-4">
          <div className="text-xl font-bold text-white">Admin</div>

          <div className="flex items-center gap-2">
            <Button
              className="border"
              style={{
                backgroundColor: "rgba(255,255,255,0.06)",
                borderColor: "rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.88)",
              }}
              onClick={() => {
                setAdminAuthed(false);
                setAdminPassword("");
                setAdminToken(null);
              }}
            >
              로그아웃
            </Button>

            <Button className="text-black hover:opacity-90" style={{ backgroundColor: ACCENT }} onClick={() => navigate("/")}>
              홈으로
            </Button>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {AdminTabs.map((t) => {
            const selected = adminTab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setAdminTab(t.key)}
                className="focus-accent whitespace-nowrap px-4 py-2 rounded-full text-sm border transition-all"
                style={{
                  backgroundColor: selected ? ACCENT : "rgba(255,255,255,0.06)",
                  borderColor: selected ? ACCENT : "rgba(255,255,255,0.12)",
                  color: selected ? "#0b0b0b" : "rgba(255,255,255,0.85)",
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6 rounded-3xl border overflow-hidden" style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)" }}>
          {children}
        </div>
      </div>
    </section>
  );

  const Modal = ({ open, title, children, onClose }: { open: boolean; title: string; children: ReactNode; onClose: () => void }) => {
    if (!open) return null;
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black/60" onClick={onClose} />
        <div className="relative w-full max-w-lg rounded-3xl border p-5 md:p-6" style={{ borderColor: "rgba(255,255,255,0.14)", background: "rgba(20,20,20,0.92)" }}>
          <div className="flex items-start justify-between gap-4">
            <div className="text-lg font-bold text-white/90">{title}</div>
            <button
              className="focus-accent w-9 h-9 rounded-2xl border flex items-center justify-center"
              style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)" }}
              onClick={onClose}
              aria-label="close"
            >
              <X className="h-4 w-4" style={{ color: "rgba(255,255,255,0.85)" }} />
            </button>
          </div>
          <div className="mt-4">{children}</div>
        </div>
      </div>
    );
  };

  const AdminAuthView = () => (
    <section className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "#000" }}>
      <div className="w-full max-w-md rounded-3xl border p-6 md:p-8" style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)" }}>
        <div className="text-xl font-bold text-white">Admin Login</div>

        <div className="mt-6">
          <input
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            placeholder="Enter password"
            className="mt-2 w-full rounded-2xl px-4 py-3 text-sm border focus:outline-none"
            style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.92)" }}
          />
        </div>

        <div className="mt-6 flex items-center gap-2">
          <Button
            className="flex-1 text-black hover:opacity-90"
            style={{ backgroundColor: ACCENT }}
            onClick={() => {
              apiClient
                .loginAdmin(adminPassword)
                .then((res) => {
                  setAdminToken(res.accessToken);
                  setAdminAuthed(true);
                  setAdminPassword("");
                })
                .catch(() => {
                  alert("비밀번호가 올바르지 않습니다.");
                });
            }}
          >
            로그인 →
          </Button>

          <Button
            className="border"
            style={{ backgroundColor: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.88)" }}
            onClick={() => navigate("/")}
          >
            홈으로
          </Button>
        </div>
      </div>
    </section>
  );

  const AdminActivityPanel = () => {
    const { data: activityCategoriesData } = useActivityCategories();
    const apiCategories = useMemo(
      () =>
        (Array.isArray(activityCategoriesData) ? activityCategoriesData : [])
          .filter((item) => item?.key && item?.label)
          .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
          .map((item) => ({ key: String(item.key), label: item.label, iconKey: item.iconKey })),
      [activityCategoriesData]
    );
    const categories = useMemo(
      () => (apiCategories.length ? apiCategories : FIXED_CATEGORIES),
      [apiCategories]
    );
    const [year, setYear] = useState(String(new Date().getFullYear()));
    const [yearOptions, setYearOptions] = useState<string[]>([String(new Date().getFullYear())]);
    const [category, setCategory] = useState(categories[0]?.key ?? "STUDY");
    const [activityItems, setActivityItems] = useState<any[]>([]);

    const [editing, setEditing] = useState<{ item: any; idx: number } | null>(null);
    const [editForm, setEditForm] = useState({ title: "", year: "", category: "", href: "", image: "", iconKey: "", iconUrl: "" });

    const [deleteTarget, setDeleteTarget] = useState<{ item: any; idx: number } | null>(null);
    const [addOpen, setAddOpen] = useState(false);
    const [addForm, setAddForm] = useState({ title: "", year: year, category: category, href: "", image: "", iconKey: "", iconUrl: "" });

    const filtered = activityItems;

    const loadActivities = useCallback(async () => {
      if (!adminToken) return;
      const parsedYear = Number(year);
      if (!Number.isFinite(parsedYear)) return;
      try {
        const result = await apiClient.getAdminActivities(parsedYear, category);
        setActivityItems(Array.isArray(result) ? result : []);
      } catch {
        setActivityItems([]);
        alert("활동 목록을 불러오지 못했습니다.");
      }
    }, [adminToken, year, category]);

    useEffect(() => {
      if (!adminAuthed) return;
      loadActivities();
    }, [adminAuthed, loadActivities]);

    useEffect(() => {
      if (!adminAuthed) return;
      const loadYears = async () => {
        try {
          const result = await apiClient.getActivities();
          const values = Array.isArray(result)
            ? result
                .map((item) => item?.year)
                .filter((y) => y !== null && y !== undefined)
                .map((y) => String(y))
            : [];
          const unique = Array.from(new Set(values));
          if (!unique.includes(year)) {
            unique.push(year);
          }
          unique.sort((a, b) => Number(b) - Number(a));
          setYearOptions(unique.length ? unique : [year]);
        } catch {
          setYearOptions((prev) => (prev.length ? prev : [year]));
        }
      };
      loadYears();
    }, [adminAuthed, year]);

    useEffect(() => {
      if (!categories.length) return;
      if (!categories.find((item) => item.key === category)) {
        setCategory(categories[0].key);
      }
    }, [categories, category]);


    const openEditPage = (item: any, idx: number) => {
      setEditing({ item, idx });
      setEditForm({
        title: item.title,
        year: item.year,
        category: item.category,
        href: item.href || "",
        image: item.image || "",
        iconKey: item.iconKey || "",
        iconUrl: item.iconUrl || "",
      });
    };

    const closeEditPage = () => {
      setEditing(null);
      setEditForm({ title: "", year: "", category: "", href: "", image: "", iconKey: "", iconUrl: "" });
    };

    const saveEditPage = async () => {
      if (!editing) return;
      try {
        await apiClient.updateAdminActivity(editing.item.id, {
          title: editForm.title,
          year: Number(editForm.year),
          category: editForm.category,
          href: editForm.href || null,
          image: editForm.image || null,
          iconKey: editForm.iconKey || null,
          iconUrl: editForm.iconUrl || null,
        });
        closeEditPage();
        loadActivities();
      } catch {
        alert("수정에 실패했습니다.");
      }
    };

    const confirmDelete = async () => {
      if (!deleteTarget) return;
      try {
        await apiClient.deleteAdminActivity(deleteTarget.item.id);
        setDeleteTarget(null);
        loadActivities();
      } catch {
        alert("삭제에 실패했습니다.");
      }
    };

    const openAdd = () => {
      setAddForm({ title: "", year, category, href: "", image: "", iconKey: "", iconUrl: "" });
      setAddOpen(true);
    };

    const submitAdd = async () => {
      if (!addForm.title?.trim()) {
        alert("Title을 입력해주세요.");
        return;
      }

      try {
        await apiClient.createAdminActivity({
          title: addForm.title,
          year: Number(addForm.year),
          category: addForm.category,
          href: addForm.href || null,
          image: addForm.image || null,
          iconKey: addForm.iconKey || null,
          iconUrl: addForm.iconUrl || null,
        });
        setYear(String(addForm.year));
        setCategory(addForm.category);
        setYearOptions((prev) => {
          const next = new Set(prev);
          next.add(String(addForm.year));
          return Array.from(next).sort((a, b) => Number(b) - Number(a));
        });
        setAddOpen(false);
        loadActivities();
      } catch {
        alert("추가에 실패했습니다.");
      }
    };

    const IconPicker = ({ value, onChange }: { value?: string; onChange: (next: string) => void }) => (
      <div className="mt-2 grid grid-cols-6 gap-2">
        <button
          type="button"
          className="focus-accent w-10 h-10 rounded-2xl border flex items-center justify-center"
          style={{
            backgroundColor: !value ? ACCENT : "rgba(255,255,255,0.06)",
            borderColor: !value ? ACCENT : "rgba(255,255,255,0.12)",
          }}
          onClick={() => onChange("")}
          aria-label="icon none"
        >
          <X className="h-4 w-4" style={{ color: !value ? "#0b0b0b" : "rgba(255,255,255,0.7)" }} />
        </button>
        {ACTIVITY_ICON_KEYS.map((key) => {
          const Icon = getActivityIconByKey(key);
          const selected = value === key;
          return (
            <button
              key={key}
              type="button"
              className="focus-accent w-10 h-10 rounded-2xl border flex items-center justify-center"
              style={{
                backgroundColor: selected ? ACCENT : "rgba(255,255,255,0.06)",
                borderColor: selected ? ACCENT : "rgba(255,255,255,0.12)",
              }}
              onClick={() => onChange(key)}
              aria-label={`icon ${key}`}
            >
              <Icon className="h-4 w-4" style={{ color: selected ? "#0b0b0b" : "rgba(255,255,255,0.85)" }} />
            </button>
          );
        })}
      </div>
    );

    if (editing) {
      return (
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-6 flex-col md:flex-row">
            <div>
              <div className="flex items-center gap-2">
                <button
                  className="focus-accent w-10 h-10 rounded-2xl border flex items-center justify-center"
                  style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.18)" }}
                  onClick={closeEditPage}
                  aria-label="back"
                >
                  <ArrowLeft className="h-5 w-5" style={{ color: "rgba(255,255,255,0.85)" }} />
                </button>
                <div className="text-xl font-bold text-white/90">Activity 수정</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button className="border" style={{ backgroundColor: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.88)" }} onClick={closeEditPage}>
                취소
              </Button>
              <Button className="text-black hover:opacity-90" style={{ backgroundColor: ACCENT }} onClick={saveEditPage}>
                저장
              </Button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-3xl border p-5 md:col-span-2" style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.18)" }}>
              <div className="text-sm font-semibold text-white/90">기본 정보</div>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-white/60">Title</div>
                  <input
                    value={editForm.title}
                    onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
                    className="mt-2 w-full rounded-2xl px-4 py-3 text-sm border focus:outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.92)" }}
                  />
                </div>

                <div>
                  <div className="text-xs text-white/60">Year</div>
                  <input
                    value={editForm.year}
                    onChange={(e) => setEditForm((p) => ({ ...p, year: e.target.value }))}
                    className="mt-2 w-full rounded-2xl px-4 py-3 text-sm border focus:outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.92)" }}
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="text-xs text-white/60">Category</div>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm((p) => ({ ...p, category: e.target.value }))}
                    className="mt-2 w-full rounded-2xl px-4 py-3 text-sm border focus:outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.92)" }}
                  >
                    {categories.map((c) => (
                      <option key={c.key} value={c.key} style={{ color: "#000" }}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="text-xs text-white/60">Href (optional)</div>
                  <input
                    value={editForm.href}
                    onChange={(e) => setEditForm((p) => ({ ...p, href: e.target.value }))}
                    className="mt-2 w-full rounded-2xl px-4 py-3 text-sm border focus:outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.92)" }}
                  />
                </div>

                <div>
                  <div className="text-xs text-white/60">Image (optional)</div>
                  <input
                    value={editForm.image}
                    onChange={(e) => setEditForm((p) => ({ ...p, image: e.target.value }))}
                    className="mt-2 w-full rounded-2xl px-4 py-3 text-sm border focus:outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.92)" }}
                  />
                </div>

                <div>
                  <div className="text-xs text-white/60">Icon Key (optional)</div>
                  <IconPicker value={editForm.iconKey} onChange={(next) => setEditForm((p) => ({ ...p, iconKey: next }))} />
                </div>

                <div>
                  <div className="text-xs text-white/60">Icon URL (optional)</div>
                  <input
                    value={editForm.iconUrl}
                    onChange={(e) => setEditForm((p) => ({ ...p, iconUrl: e.target.value }))}
                    className="mt-2 w-full rounded-2xl px-4 py-3 text-sm border focus:outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.92)" }}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6 md:p-8">
        <div className="flex items-start justify-between gap-6 flex-col md:flex-row">
          <div className="text-xl font-bold text-white/90">Activity 관리</div>

          <div className="flex items-center gap-2">
            <Button className="text-black hover:opacity-90" style={{ backgroundColor: ACCENT }} onClick={openAdd}>
              활동 추가
            </Button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border p-4" style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.18)" }}>
            <div className="text-sm font-semibold text-white/90">연도</div>

            <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {yearOptions.map((y) => {
                const selected = year === y;
                return (
                  <button
                    key={y}
                    onClick={() => setYear(y)}
                    className="focus-accent whitespace-nowrap px-4 py-2 rounded-full text-sm border transition-all"
                    style={{
                      backgroundColor: selected ? ACCENT : "rgba(255,255,255,0.06)",
                      borderColor: selected ? ACCENT : "rgba(255,255,255,0.12)",
                      color: selected ? "#0b0b0b" : "rgba(255,255,255,0.85)",
                    }}
                  >
                    {y}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border p-4" style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.18)" }}>
            <div className="text-sm font-semibold text-white/90">카테고리</div>

            <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {categories.map((c) => {
                const selected = category === c.key;
                return (
                  <button
                    key={c.key}
                    onClick={() => setCategory(c.key)}
                    className="focus-accent whitespace-nowrap px-4 py-2 rounded-full text-sm border transition-all"
                    style={{
                      backgroundColor: selected ? ACCENT : "rgba(255,255,255,0.06)",
                      borderColor: selected ? ACCENT : "rgba(255,255,255,0.12)",
                      color: selected ? "#0b0b0b" : "rgba(255,255,255,0.85)",
                    }}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="text-sm font-semibold text-white/90 mb-3">목록</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((item) => {
              const idx = activityItems.indexOf(item);
              const categoryIconKey = categories.find((c) => c.key === item.category)?.iconKey;
              const Icon = getActivityIconByKey(item.iconKey || categoryIconKey);

              return (
                <div
                  key={`${item.year}-${item.category}-${item.title}-${idx}`}
                  className="rounded-2xl border p-4 flex items-start justify-between gap-4"
                  style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)" }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center border" style={{ background: "rgba(0,0,0,0.18)", borderColor: "rgba(255,255,255,0.12)" }}>
                      {item.iconUrl ? (
                        <img src={item.iconUrl} alt="icon" className="w-5 h-5 object-contain" />
                      ) : (
                        <Icon className="h-5 w-5" style={{ color: ACCENT }} />
                      )}
                    </div>

                    <div>
                      <div className="text-white/90 font-semibold">{item.title}</div>
                      <div className="mt-1 text-xs text-white/55">
                        {item.year} · {categories.find((c) => c.key === item.category)?.label ?? item.category}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button className="border" style={{ backgroundColor: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.88)" }} onClick={() => openEditPage(item, idx)}>
                      수정
                    </Button>

                    <Button className="border" style={{ backgroundColor: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.88)" }} onClick={() => setDeleteTarget({ item, idx })}>
                      삭제
                    </Button>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="rounded-2xl border p-10 text-center text-white/60" style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)" }}>
                선택한 연도/카테고리에 활동이 없습니다.
              </div>
            )}
          </div>
        </div>

        <Modal open={addOpen} title="활동 추가" onClose={() => setAddOpen(false)}>
          <div className="max-h-[70vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 gap-4">
            <div>
              <div className="text-xs text-white/60">Title</div>
              <input
                value={addForm.title}
                onChange={(e) => setAddForm((p) => ({ ...p, title: e.target.value }))}
                className="mt-2 w-full rounded-2xl px-4 py-3 text-sm border focus:outline-none"
                style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.92)" }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-white/60">Year</div>
                <input
                  value={addForm.year}
                  onChange={(e) => setAddForm((p) => ({ ...p, year: e.target.value }))}
                  className="mt-2 w-full rounded-2xl px-4 py-3 text-sm border focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.92)" }}
                />
              </div>
              <div>
                <div className="text-xs text-white/60">Category</div>
                <select
                  value={addForm.category}
                  onChange={(e) => setAddForm((p) => ({ ...p, category: e.target.value }))}
                  className="mt-2 w-full rounded-2xl px-4 py-3 text-sm border focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.92)" }}
                >
                  {categories.map((c) => (
                    <option key={c.key} value={c.key} style={{ color: "#000" }}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="text-xs text-white/60">Href (optional)</div>
              <input
                value={addForm.href}
                onChange={(e) => setAddForm((p) => ({ ...p, href: e.target.value }))}
                className="mt-2 w-full rounded-2xl px-4 py-3 text-sm border focus:outline-none"
                style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.92)" }}
              />
            </div>

            <div>
              <div className="text-xs text-white/60">Image (optional)</div>
              <input
                value={addForm.image}
                onChange={(e) => setAddForm((p) => ({ ...p, image: e.target.value }))}
                className="mt-2 w-full rounded-2xl px-4 py-3 text-sm border focus:outline-none"
                style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.92)" }}
              />
            </div>

            <div>
              <div className="text-xs text-white/60">Icon Key (optional)</div>
              <IconPicker value={addForm.iconKey} onChange={(next) => setAddForm((p) => ({ ...p, iconKey: next }))} />
            </div>

            <div>
              <div className="text-xs text-white/60">Icon URL (optional)</div>
              <input
                value={addForm.iconUrl}
                onChange={(e) => setAddForm((p) => ({ ...p, iconUrl: e.target.value }))}
                className="mt-2 w-full rounded-2xl px-4 py-3 text-sm border focus:outline-none"
                style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.92)" }}
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button className="border" style={{ backgroundColor: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.88)" }} onClick={() => setAddOpen(false)}>
                취소
              </Button>
              <Button className="text-black hover:opacity-90" style={{ backgroundColor: ACCENT }} onClick={submitAdd}>
                추가
              </Button>
            </div>
            </div>
          </div>
        </Modal>

        <Modal open={!!deleteTarget} title="삭제 확인" onClose={() => setDeleteTarget(null)}>
          <div className="text-sm text-white/80 leading-relaxed">
            <span style={{ color: ACCENT }}>&quot;{deleteTarget?.item?.title}&quot;</span> 활동을 삭제할까요?
          </div>
          <div className="mt-6 flex items-center justify-end gap-2">
            <Button className="border" style={{ backgroundColor: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.88)" }} onClick={() => setDeleteTarget(null)}>
              취소
            </Button>
            <Button className="text-black hover:opacity-90" style={{ backgroundColor: ACCENT }} onClick={confirmDelete}>
              삭제
            </Button>
          </div>
        </Modal>
      </div>
    );
  };

  const AdminRecruitPanel = () => {
    const [applyLink, setApplyLink] = useState("");

    const [bannerTitle, setBannerTitle] = useState("");
    const [bannerDesc, setBannerDesc] = useState("");
    const [bannerImage, setBannerImage] = useState("");
    const [bannerPreviewOpen, setBannerPreviewOpen] = useState(false);

    const [winnersPublic, setWinnersPublic] = useState(false);
    const [winnerNotice, setWinnerNotice] = useState("");
    const [winnersOpen, setWinnersOpen] = useState(false);
    const [winnerNames, setWinnerNames] = useState<any[]>([]);
    const [winnersPreviewOpen, setWinnersPreviewOpen] = useState(false);

    const loadRecruitment = useCallback(async () => {
      if (!adminToken) return;
      try {
        const data = await apiClient.getAdminRecruitment();
        setApplyLink(data?.applyLink ?? "");
        setBannerTitle(data?.bannerTitle ?? "");
        setBannerDesc(data?.bannerDesc ?? "");
        setBannerImage(data?.bannerImage ?? "");
      } catch {
        alert("모집 정보를 불러오지 못했습니다.");
      }
    }, [adminToken]);

    const loadWinners = useCallback(async () => {
      if (!adminToken) return;
      try {
        const data = await apiClient.getAdminWinners();
        setWinnersPublic(!!data?.isPublic);
        setWinnerNotice(data?.notice ?? "");
        const names = Array.isArray(data?.names) ? data.names : [];
        const sorted = names.slice().sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
        setWinnerNames(sorted);
      } catch {
        alert("합격자 정보를 불러오지 못했습니다.");
      }
    }, [adminToken]);

    useEffect(() => {
      if (!adminAuthed) return;
      loadRecruitment();
      loadWinners();
    }, [adminAuthed, loadRecruitment, loadWinners]);

    const onSave = async () => {
      try {
        await apiClient.updateAdminRecruitment({
          applyLink,
          bannerTitle,
          bannerDesc,
          bannerImage,
        });

        await apiClient.updateAdminWinnersSettings({
          isPublic: winnersPublic,
          notice: winnerNotice,
        });

        const normalized = winnerNames.map((n, idx) => ({
          ...n,
          orderIndex: idx,
        }));

        await Promise.all(
          normalized.map((n) =>
            n.id
              ? apiClient.updateAdminWinnerName(n.id, { name: n.name, orderIndex: n.orderIndex })
              : n.name?.trim()
                ? apiClient.createAdminWinnerName({ name: n.name, orderIndex: n.orderIndex })
                : Promise.resolve()
          )
        );

        await loadWinners();
        alert("저장 완료!");
      } catch {
        alert("저장에 실패했습니다.");
      }
    };

    const addWinnerName = () => setWinnerNames((p) => [...p, { id: null, name: "", orderIndex: p.length }]);
    const updateWinnerName = (idx: number, v: string) =>
      setWinnerNames((p) => p.map((x, i) => (i === idx ? { ...x, name: v } : x)));
    const removeWinnerName = async (idx: number) => {
      const target = winnerNames[idx];
      if (target?.id) {
        try {
          await apiClient.deleteAdminWinnerName(target.id);
        } catch {
          alert("삭제에 실패했습니다.");
          return;
        }
      }
      setWinnerNames((p) => p.filter((_, i) => i !== idx));
    };

    const BannerPreview = ({ compact = false }: { compact?: boolean }) => (
      <div
        className={`rounded-3xl border p-5 ${compact ? "" : "md:p-7"}`}
        style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)" }}
      >
        <div className="text-sm font-semibold text-white/90">배너 미리보기</div>

        <div className="mt-4 rounded-3xl border overflow-hidden" style={{ borderColor: "rgba(255,255,255,0.10)", background: "rgba(0,0,0,0.20)" }}>
          {bannerImage ? (
            <div className="w-full aspect-[16/6] bg-black/40">
              <img src={bannerImage} alt="banner" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-full aspect-[16/6] flex items-center justify-center text-white/40 text-sm">(이미지 없음)</div>
          )}

          <div className="p-5 md:p-6">
            <div className="text-2xl md:text-3xl font-bold tracking-tight text-white/95">{bannerTitle || "제목 없음"}</div>
            <div className="mt-3 text-sm md:text-base text-white/70 whitespace-pre-line leading-relaxed">{bannerDesc || "설명 없음"}</div>
          </div>
        </div>

        {!compact && (
          <div className="mt-4 flex justify-end">
            <Button className="border" style={{ backgroundColor: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.88)" }} onClick={() => setBannerPreviewOpen(true)}>
              전체 미리보기
            </Button>
          </div>
        )}
      </div>
    );

    const WinnersPreview = () => (
      <div className="w-full">
        <div className="text-sm text-white/70">
          공개 여부: <span style={{ color: ACCENT }}>{winnersPublic ? "공개" : "비공개"}</span>
        </div>

        <div className="mt-4 rounded-3xl border p-5" style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.18)" }}>
          <div className="text-lg font-bold text-white/90">합격자 안내</div>

          <div className="mt-3 text-sm text-white/70 whitespace-pre-line leading-relaxed">{winnerNotice ? winnerNotice : "(안내 메시지 없음)"}</div>

          <div className="mt-6">
            <button
              onClick={() => setWinnersOpen((p) => !p)}
              className="w-full flex items-center justify-between gap-4 text-left rounded-2xl px-4 py-3 border transition-all focus-accent"
              style={{
                backgroundColor: winnersOpen ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.06)",
                borderColor: winnersOpen ? `${ACCENT}CC` : "rgba(255,255,255,0.12)",
                boxShadow: winnersOpen ? `0 0 0 1px ${ACCENT}22` : "none",
              }}
            >
              <div className="text-sm font-semibold text-white/90">합격자 명단</div>
              <div className={`text-white/50 text-xl leading-none transition-transform ${winnersOpen ? "rotate-45" : "rotate-0"}`} style={{ color: winnersOpen ? ACCENT : "rgba(255,255,255,0.55)" }}>
                +
              </div>
            </button>

            <div className={`overflow-hidden transition-all duration-300 ${winnersOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"}`}>
              <div className="mt-4 rounded-2xl border p-4" style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.18)" }}>
                {winnersPublic ? (
                  winnerNames.length ? (
                    <ul className="space-y-2 text-white/80 text-sm">
                      {winnerNames.map((n, i) => (
                        <li key={n.id ?? `winner-${i}`}>
                          • {n.name || `(이름 ${i + 1} 비어있음)`}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-white/55 text-sm">(명단 없음)</div>
                  )
                ) : (
                  <div className="text-white/55 text-sm">(비공개 상태입니다)</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <div className="p-6 md:p-8">
        <div className="flex items-start justify-between gap-6 flex-col md:flex-row">
          <div className="text-xl font-bold text-white/90">Recruitment 관리</div>

          <div className="flex items-center gap-2">
            <Button
              className="border"
              style={{
                backgroundColor: "rgba(255,255,255,0.06)",
                borderColor: "rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.88)",
              }}
              onClick={() => setWinnersPreviewOpen(true)}
            >
              합격자 조회 미리보기
            </Button>

            <Button className="text-black hover:opacity-90" style={{ backgroundColor: ACCENT }} onClick={onSave}>
              저장
            </Button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-3xl border p-5" style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.18)" }}>
            <div className="text-sm font-semibold text-white/90">지원 링크</div>
            <input
              value={applyLink}
              onChange={(e) => setApplyLink(e.target.value)}
              placeholder="https://..."
              className="mt-4 w-full rounded-2xl px-4 py-3 text-sm border focus:outline-none"
              style={{
                background: "rgba(255,255,255,0.05)",
                borderColor: "rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.92)",
              }}
            />
          </div>

          <BannerPreview />

          <div className="rounded-3xl border p-5 md:col-span-2" style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.18)" }}>
            <div className="text-sm font-semibold text-white/90">배너 편집</div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-white/60">배너 제목</div>
                <input
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  placeholder="예: 2026 상반기 모집"
                  className="mt-2 w-full rounded-2xl px-4 py-3 text-sm border focus:outline-none"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    borderColor: "rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.92)",
                  }}
                />
              </div>

              <div>
                <div className="text-xs text-white/60">배너 이미지(URL/파일명)</div>
                <input
                  value={bannerImage}
                  onChange={(e) => setBannerImage(e.target.value)}
                  placeholder="예: banner.png 또는 https://..."
                  className="mt-2 w-full rounded-2xl px-4 py-3 text-sm border focus:outline-none"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    borderColor: "rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.92)",
                  }}
                />
                <div className="mt-3 flex items-center gap-2">
                  <Button
                    className="border"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.06)",
                      borderColor: "rgba(255,255,255,0.12)",
                      color: "rgba(255,255,255,0.88)",
                    }}
                    onClick={() => alert("현재는 URL/파일명 입력 방식으로만 동작합니다.")}
                  >
                    업로드
                  </Button>
                  <Button
                    className="border"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.06)",
                      borderColor: "rgba(255,255,255,0.12)",
                      color: "rgba(255,255,255,0.88)",
                    }}
                    onClick={() => setBannerPreviewOpen(true)}
                  >
                    전체 미리보기
                  </Button>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="text-xs text-white/60">배너 설명</div>
                <textarea
                  value={bannerDesc}
                  onChange={(e) => setBannerDesc(e.target.value)}
                  placeholder="모집 일정/대상/활동 내용 등을 간단히"
                  className="mt-2 w-full min-h-[120px] rounded-2xl px-4 py-3 text-sm border focus:outline-none"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    borderColor: "rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.92)",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border p-5 md:col-span-2" style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.18)" }}>
            <div className="flex items-center justify-between gap-4 flex-col md:flex-row">
              <div className="text-sm font-semibold text-white/90">합격자</div>

              <div className="flex items-center gap-2">
                {[{ key: false, label: "비공개" }, { key: true, label: "공개" }].map((opt) => {
                  const selected = winnersPublic === opt.key;
                  return (
                    <button
                      key={String(opt.key)}
                      onClick={() => setWinnersPublic(opt.key)}
                      className="focus-accent px-4 py-2 rounded-full text-sm border transition-all"
                      style={{
                        backgroundColor: selected ? ACCENT : "rgba(255,255,255,0.06)",
                        borderColor: selected ? ACCENT : "rgba(255,255,255,0.12)",
                        color: selected ? "#0b0b0b" : "rgba(255,255,255,0.85)",
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rounded-3xl border p-5" style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)" }}>
                <div className="text-sm font-semibold text-white/90">합격자 안내 메시지</div>
                <textarea
                  value={winnerNotice}
                  onChange={(e) => setWinnerNotice(e.target.value)}
                  placeholder="합격자 안내 내용을 입력하세요."
                  className="mt-4 w-full min-h-[180px] rounded-2xl px-4 py-3 text-sm border focus:outline-none"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    borderColor: "rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.92)",
                  }}
                />
              </div>

              <div className="rounded-3xl border p-5" style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)" }}>
                <button
                  onClick={() => setWinnersOpen((p) => !p)}
                  className="w-full flex items-center justify-between gap-4 text-left rounded-2xl px-4 py-3 border transition-all focus-accent"
                  style={{
                    backgroundColor: winnersOpen ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.06)",
                    borderColor: winnersOpen ? `${ACCENT}CC` : "rgba(255,255,255,0.12)",
                    boxShadow: winnersOpen ? `0 0 0 1px ${ACCENT}22` : "none",
                  }}
                >
                  <div className="text-sm font-semibold text-white/90">합격자 명단</div>
                  <div className={`text-white/50 text-xl leading-none transition-transform ${winnersOpen ? "rotate-45" : "rotate-0"}`} style={{ color: winnersOpen ? ACCENT : "rgba(255,255,255,0.55)" }}>
                    +
                  </div>
                </button>

                <div className={`overflow-hidden transition-all duration-300 ${winnersOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="mt-4 space-y-2">
                    {winnerNames.map((name, idx) => (
                      <div key={name.id ?? `winner-${idx}`} className="flex items-center gap-2 rounded-2xl border p-3" style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.18)" }}>
                        <input
                          value={name.name}
                          onChange={(e) => updateWinnerName(idx, e.target.value)}
                          className="w-full rounded-xl px-3 py-2 text-sm border focus:outline-none"
                          style={{
                            background: "rgba(255,255,255,0.05)",
                            borderColor: "rgba(255,255,255,0.12)",
                            color: "rgba(255,255,255,0.92)",
                          }}
                          placeholder={`합격자 ${idx + 1}`}
                        />
                        <Button
                          className="border"
                          style={{
                            backgroundColor: "rgba(255,255,255,0.06)",
                            borderColor: "rgba(255,255,255,0.12)",
                            color: "rgba(255,255,255,0.88)",
                          }}
                          onClick={() => removeWinnerName(idx)}
                        >
                          삭제
                        </Button>
                      </div>
                    ))}

                    <div className="pt-2 flex justify-end">
                      <Button className="text-black hover:opacity-90" style={{ backgroundColor: ACCENT }} onClick={addWinnerName}>
                        추가
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal open={bannerPreviewOpen} title="배너 전체 미리보기" onClose={() => setBannerPreviewOpen(false)}>
          <BannerPreview compact />
        </Modal>

        <Modal open={winnersPreviewOpen} title="합격자 조회 미리보기" onClose={() => setWinnersPreviewOpen(false)}>
          <WinnersPreview />
        </Modal>
      </div>
    );
  };

  const AdminFaqPanel = () => {
    const [faqItems, setFaqItems] = useState<any[]>([]);
    const [faqAddOpen, setFaqAddOpen] = useState(false);
    const [faqDraft, setFaqDraft] = useState({ q: "", a: "" });

    const loadFaqs = useCallback(async () => {
      if (!adminToken) return;
      try {
        const result = await apiClient.getAdminFaqs();
        const normalized = Array.isArray(result)
          ? result.map((item) => ({
              ...item,
              question: item?.question ?? item?.q ?? "",
              answer: item?.answer ?? item?.a ?? "",
            }))
          : [];
        setFaqItems(normalized);
      } catch {
        setFaqItems([]);
        alert("FAQ 목록을 불러오지 못했습니다.");
      }
    }, [adminToken]);

    useEffect(() => {
      if (!adminAuthed) return;
      loadFaqs();
    }, [adminAuthed, loadFaqs]);

    const onSave = () => {
      loadFaqs();
    };

    const [faqEditOpen, setFaqEditOpen] = useState(false);
    const [faqEditId, setFaqEditId] = useState<string | null>(null);
    const [faqEditDraft, setFaqEditDraft] = useState({ q: "", a: "" });

    const [faqDeleteTarget, setFaqDeleteTarget] = useState<{ item: any; idx: number } | null>(null);

    const onOpenAdd = () => {
      setFaqDraft({ q: "", a: "" });
      setFaqAddOpen(true);
    };

    const onSubmitAdd = async () => {
      if (!faqDraft.q.trim()) {
        alert("질문을 입력해주세요.");
        return;
      }
      try {
        await apiClient.createAdminFaq({
          question: faqDraft.q,
          answer: faqDraft.a,
        });
        setFaqAddOpen(false);
        loadFaqs();
      } catch {
        alert("FAQ 추가에 실패했습니다.");
      }
    };

    const onOpenEdit = (item: any) => {
      setFaqEditId(item?.id ? String(item.id) : null);
      setFaqEditDraft({ q: item.question, a: item.answer });
      setFaqEditOpen(true);
    };

    const onSubmitEdit = async () => {
      if (!faqEditId) {
        alert("수정할 FAQ를 찾지 못했습니다.");
        return;
      }
      try {
        await apiClient.updateAdminFaq(faqEditId, {
          question: faqEditDraft.q,
          answer: faqEditDraft.a,
        });
        setFaqEditOpen(false);
        setFaqEditId(null);
        loadFaqs();
      } catch {
        alert("FAQ 수정에 실패했습니다.");
      }
    };

    const onConfirmDelete = async () => {
      if (!faqDeleteTarget) return;
      const targetId = faqDeleteTarget.item?.id ? String(faqDeleteTarget.item.id) : null;
      if (!targetId) {
        alert("삭제할 FAQ를 찾지 못했습니다.");
        return;
      }
      try {
        await apiClient.deleteAdminFaq(targetId);
        setFaqDeleteTarget(null);
        loadFaqs();
      } catch {
        alert("FAQ 삭제에 실패했습니다.");
      }
    };

    return (
      <div className="p-6 md:p-8">
        <div className="flex items-start justify-between gap-6 flex-col md:flex-row">
          <div className="text-xl font-bold text-white/90">FAQ 관리</div>

          <div className="flex items-center gap-2">
            <Button className="text-black hover:opacity-90" style={{ backgroundColor: ACCENT }} onClick={onOpenAdd}>
              추가
            </Button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4">
          {faqItems.map((item, idx) => (
            <div key={item.id ?? `${item.question}-${idx}`} className="rounded-2xl border p-5" style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)" }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-white/90 font-semibold">{item.question}</div>
                  <div className="mt-2 text-sm text-white/65 whitespace-pre-line">{item.answer}</div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    className="border"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.06)",
                      borderColor: "rgba(255,255,255,0.12)",
                      color: "rgba(255,255,255,0.88)",
                    }}
                    onClick={() => onOpenEdit(item)}
                  >
                    수정
                  </Button>

                  <Button
                    className="border"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.06)",
                      borderColor: "rgba(255,255,255,0.12)",
                      color: "rgba(255,255,255,0.88)",
                    }}
                    onClick={() => setFaqDeleteTarget({ item, idx })}
                  >
                    삭제
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Modal open={faqAddOpen} title="FAQ 추가" onClose={() => setFaqAddOpen(false)}>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <div className="text-xs text-white/60">질문</div>
              <input
                value={faqDraft.q}
                onChange={(e) => setFaqDraft((p) => ({ ...p, q: e.target.value }))}
                className="mt-2 w-full rounded-2xl px-4 py-3 text-sm border focus:outline-none"
                style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.92)" }}
              />
            </div>

            <div>
              <div className="text-xs text-white/60">답변</div>
              <textarea
                value={faqDraft.a}
                onChange={(e) => setFaqDraft((p) => ({ ...p, a: e.target.value }))}
                className="mt-2 w-full min-h-[120px] rounded-2xl px-4 py-3 text-sm border focus:outline-none"
                style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.92)" }}
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button className="border" style={{ backgroundColor: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.88)" }} onClick={() => setFaqAddOpen(false)}>
                취소
              </Button>
              <Button className="text-black hover:opacity-90" style={{ backgroundColor: ACCENT }} onClick={onSubmitAdd}>
                추가
              </Button>
            </div>
          </div>
        </Modal>

        <Modal open={faqEditOpen} title="FAQ 수정" onClose={() => setFaqEditOpen(false)}>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <div className="text-xs text-white/60">질문</div>
              <input
                value={faqEditDraft.q}
                onChange={(e) => setFaqEditDraft((p) => ({ ...p, q: e.target.value }))}
                className="mt-2 w-full rounded-2xl px-4 py-3 text-sm border focus:outline-none"
                style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.92)" }}
              />
            </div>

            <div>
              <div className="text-xs text-white/60">답변</div>
              <textarea
                value={faqEditDraft.a}
                onChange={(e) => setFaqEditDraft((p) => ({ ...p, a: e.target.value }))}
                className="mt-2 w-full min-h-[140px] rounded-2xl px-4 py-3 text-sm border focus:outline-none"
                style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.92)" }}
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button className="border" style={{ backgroundColor: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.88)" }} onClick={() => setFaqEditOpen(false)}>
                취소
              </Button>
              <Button className="text-black hover:opacity-90" style={{ backgroundColor: ACCENT }} onClick={onSubmitEdit}>
                저장
              </Button>
            </div>
          </div>
        </Modal>

        <Modal open={!!faqDeleteTarget} title="삭제 확인" onClose={() => setFaqDeleteTarget(null)}>
          <div className="text-sm text-white/80 leading-relaxed">
            <span style={{ color: ACCENT }}>&quot;{faqDeleteTarget?.item?.question}&quot;</span> 항목을 삭제할까요?
          </div>

          <div className="mt-6 flex items-center justify-end gap-2">
            <Button className="border" style={{ backgroundColor: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.88)" }} onClick={() => setFaqDeleteTarget(null)}>
              취소
            </Button>
            <Button className="text-black hover:opacity-90" style={{ backgroundColor: ACCENT }} onClick={onConfirmDelete}>
              삭제
            </Button>
          </div>
        </Modal>
      </div>
    );
  };

  const AdminPanel = () => {
    let body = null;
    if (adminTab === "Activity") body = <AdminActivityPanel />;
    if (adminTab === "Recruitment") body = <AdminRecruitPanel />;
    if (adminTab === "FAQ") body = <AdminFaqPanel />;
    return <AdminShell>{body}</AdminShell>;
  };

  return adminAuthed || !!adminToken ? <AdminPanel /> : <AdminAuthView />;
}
