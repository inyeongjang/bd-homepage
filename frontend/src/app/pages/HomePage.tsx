import { Menu, ArrowUpRight, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useActivities, useActivityCategories, useFaqs, useRecruitInfo } from "../../api";
import { getActivityIconByKey } from "../shared/activityIcons";

const ACCENT = "#F3A537";
const SECTION_Y = "py-16 md:py-20";
const FULL_TEXT = "Knock Knock, We're Already In.";

function AccentDivider({ color }: { color: string }) {
  return <div className="mt-3 h-[2px] w-16 mx-auto rounded-full" style={{ backgroundColor: color }} />;
}

export default function HomePage() {
  const BASE = import.meta.env.BASE_URL;

  const [isScrolled, setIsScrolled] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  const [activeYear, setActiveYear] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: activityItemsData } = useActivities();
  const { data: activityCategoriesData } = useActivityCategories();
  const { data: faqItemsData } = useFaqs();
  const { data: recruitData } = useRecruitInfo();

  const activityItems = useMemo(
    () => (Array.isArray(activityItemsData) ? activityItemsData : []).filter((item) => item?.isActive !== false),
    [activityItemsData]
  );

  const faqItems = useMemo(
    () =>
      (Array.isArray(faqItemsData) ? faqItemsData : [])
        .filter((item) => item?.isActive !== false)
        .map((item) => ({
          ...item,
          question: item?.question ?? item?.q ?? "",
          answer: item?.answer ?? item?.a ?? "",
        })),
    [faqItemsData]
  );

  const recruit = recruitData ?? {};

  const scrollToSection = useCallback((id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typedText.length < FULL_TEXT.length) {
      const timeout = setTimeout(() => {
        setTypedText(FULL_TEXT.slice(0, typedText.length + 1));
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [typedText]);

  useEffect(() => {
    const interval = setInterval(() => setShowCursor((prev) => !prev), 500);
    return () => clearInterval(interval);
  }, []);

  const activityCategories = useMemo(() => {
    if (!Array.isArray(activityCategoriesData)) return [];
    return activityCategoriesData
      .filter((item) => item?.key && item?.label)
      .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
  }, [activityCategoriesData]);

  const years = useMemo(() => {
    const values = activityItems
      .map((i) => i?.year)
      .filter((y) => y !== null && y !== undefined)
      .map((y) => String(y));
    return Array.from(new Set(values)).sort((a, b) => Number(b) - Number(a));
  }, [activityItems]);

  const categories = useMemo(
    () =>
      activityCategories.map((item) => ({
        key: String(item.key),
        label: item.label,
        iconKey: item.iconKey,
      })),
    [activityCategories]
  );

  useEffect(() => {
    if (!activeYear && years.length) setActiveYear(years[0]);
  }, [years, activeYear]);

  useEffect(() => {
    if (!activeCategory && categories.length) setActiveCategory(categories[0].key);
  }, [categories, activeCategory]);

  const filteredItems = useMemo(() => {
    if (!activeYear || !activeCategory) return [];
    return activityItems
      .filter((item) => String(item.year) === activeYear)
      .filter((item) => item.category === activeCategory);
  }, [activityItems, activeYear, activeCategory]);

  const coreValues = useMemo(
    () => [
      { key: "collaboration", title: "협업", desc: "정기 세미나와 성과 발표회를 개최하여 구성원 간의 지식과 경험을 공유하고, 협업과 소통의 문화를 조성합니다." },
      { key: "expertise", title: "전문성", desc: "관련 연구 및 프로젝트 수행, 해킹대회와 공모전 참가 등을 통해 사이버 보안 분야의 전문성을 함양합니다." },
      { key: "expansion", title: "확장", desc: "외부 보안 커뮤니티와의 교류 및 현직자 특강을 통해 실무 역량을 강화하고, 지식의 외연을 확장합니다." },
    ],
    []
  );

  const [activeValueKey, setActiveValueKey] = useState<string | null>(null);
  const [activeFaqIdx, setActiveFaqIdx] = useState<number | null>(null);

  const CoreValueItem = ({ v, size = "md" }: { v: { key: string; title: string; desc: string }; size?: "sm" | "md" }) => {
    const active = activeValueKey === v.key;

    const circleClass =
      size === "sm"
        ? "w-[160px] h-[160px] text-2xl"
        : "w-[180px] h-[180px] md:w-[200px] md:h-[200px] text-2xl md:text-3xl";

    const cardWidth = size === "sm" ? "w-[280px]" : "w-[280px] md:w-[320px]";
    const cardHeight = size === "sm" ? "min-h-[170px]" : "min-h-[180px] md:min-h-[200px]";

    return (
      <div
        className="relative shrink-0 group"
        onMouseEnter={() => setActiveValueKey(v.key)}
        onMouseLeave={() => setActiveValueKey(null)}
      >
        <button
          onFocus={() => setActiveValueKey(v.key)}
          onBlur={() => setActiveValueKey(null)}
          onClick={() => setActiveValueKey((prev) => (prev === v.key ? null : v.key))}
          className={`relative ${circleClass} rounded-full flex items-center justify-center text-center p-6 transition-all duration-200 focus:outline-none
            ${active ? "opacity-0 pointer-events-none" : "opacity-100"}
          `}
          style={{
            backgroundColor: "rgba(255,255,255,0.10)",
            border: "1px solid rgba(255,255,255,0.18)",
            boxShadow: `0 0 0 1px rgba(255,255,255,0.07), 0 12px 32px rgba(0,0,0,0.55)`,
          }}
          aria-label={v.title}
        >
          <h4 className="relative z-10 font-bold tracking-tight text-white/90">{v.title}</h4>

          <span
            className="absolute inset-0 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{
              boxShadow: `0 0 0 2px ${ACCENT}AA`,
            }}
          />
        </button>

        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
            active ? "opacity-100 scale-100" : "opacity-0 scale-[0.98] pointer-events-none"
          }`}
        >
          <div
            className={`${cardWidth} ${cardHeight} rounded-2xl border backdrop-blur-md p-5 md:p-6 text-left flex flex-col justify-center`}
            style={{
              backgroundColor: "rgba(255,255,255,0.12)",
              border: `1px solid ${ACCENT}CC`,
              boxShadow: `0 0 0 1px ${ACCENT}33, 0 14px 36px rgba(0,0,0,0.55)`,
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="mb-3">
              <div className="h-[3px] w-10 rounded-full" style={{ backgroundColor: ACCENT }} />
            </div>
            <p className="text-white/90 leading-relaxed text-sm md:text-base">{v.desc}</p>
          </div>
        </div>
      </div>
    );
  };

  const Logo = ({ className = "" }: { className?: string }) => (
    <img
      src={`${BASE}logo_black.png`}
      alt="BackDoor Logo"
      className={className}
      style={{
        filter: "drop-shadow(0 8px 28px rgba(0,0,0,0.65))",
      }}
      draggable={false}
    />
  );

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .focus-accent:focus-visible { outline: 2px solid ${ACCENT}; outline-offset: 2px; }

        html, body {
          height: 100%;
          scroll-behavior: smooth;
          scroll-padding-top: 88px;
          background: #000;
          overflow-x: hidden;
          scroll-snap-type: y mandatory;
          overscroll-behavior-y: contain;
        }

        section {
          scroll-snap-align: start;
          scroll-snap-stop: always;
          scroll-margin-top: 88px;
        }
      `}</style>

      <nav
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 transition-all duration-300"
        style={{
          backgroundColor: isScrolled ? "rgba(0, 0, 0, 0.86)" : "rgba(0, 0, 0, 1)",
          WebkitBackdropFilter: isScrolled ? "blur(10px)" : "none",
          backdropFilter: isScrolled ? "blur(10px)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            className="text-2xl font-bold tracking-tight"
            style={{ color: ACCENT }}
            onClick={() => scrollToSection("home")}
          >
            BackDoor
          </button>

          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection("home")} className="text-sm text-white/70 hover:text-white transition-colors">
              Home
            </button>
            <button onClick={() => scrollToSection("about")} className="text-sm text-white/70 hover:text-white transition-colors">
              About
            </button>
            <button onClick={() => scrollToSection("activity")} className="text-sm text-white/70 hover:text-white transition-colors">
              Activity
            </button>
            <button onClick={() => scrollToSection("recruit")} className="text-sm text-white/70 hover:text-white transition-colors">
              Recruit
            </button>
            <button onClick={() => scrollToSection("qa")} className="text-sm text-white/70 hover:text-white transition-colors">
              Q&amp;A
            </button>

            <a href={recruit.applyLink || "#"} target={recruit.applyLink ? "_blank" : undefined} rel="noreferrer">
              <Button className="text-black px-4 py-2 text-sm hover:opacity-90" style={{ backgroundColor: ACCENT }}>
                지원하기 →
              </Button>
            </a>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white"
            onClick={() => setMobileOpen((p) => !p)}
            aria-label="menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-white/10" style={{ backgroundColor: "#000" }}>
            <div className="px-6 py-4 flex flex-col gap-3">
              {[
                { id: "home", label: "Home" },
                { id: "about", label: "About" },
                { id: "activity", label: "Activity" },
                { id: "recruit", label: "Recruit" },
                { id: "qa", label: "Q&A" },
              ].map((x) => (
                <button
                  key={x.id}
                  onClick={() => scrollToSection(x.id)}
                  className="text-left text-sm text-white/80 hover:text-white transition-colors py-2"
                >
                  {x.label}
                </button>
              ))}

              <a
                href={recruit.applyLink || "#"}
                target={recruit.applyLink ? "_blank" : undefined}
                rel="noreferrer"
                onClick={() => setMobileOpen(false)}
              >
                <Button className="w-full text-black hover:opacity-90" style={{ backgroundColor: ACCENT }}>
                  지원하기 →
                </Button>
              </a>
            </div>
          </div>
        )}
      </nav>

      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20" style={{ backgroundColor: "#000" }}>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
          <div className="hidden lg:grid grid-cols-2 items-center gap-6 max-w-6xl mx-auto relative">
            <div className="flex items-center justify-end pr-0">
              <Logo className="w-auto max-w-[520px] h-auto object-contain opacity-95" />
            </div>

            <div
              className="text-left relative z-20"
              style={{
                transform: "translateX(-64px) translateY(-40px)",
              }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight min-h-[10rem]">
                <span className="block mb-2">
                  {typedText.split(",")[0]}
                  {typedText.includes(",") && ","}
                  {!typedText.includes(",") && (
                    <span
                      className={`inline-block w-1 h-16 ml-2 align-middle ${
                        showCursor ? "opacity-100" : "opacity-0"
                      }`}
                      style={{ backgroundColor: ACCENT }}
                    />
                  )}
                </span>

                <span className="block whitespace-nowrap">
                  {typedText.split(",")[1] || ""}
                  {typedText.includes(",") && (
                    <span
                      className={`inline-block w-1 h-16 ml-2 align-middle ${
                        showCursor ? "opacity-100" : "opacity-0"
                      }`}
                      style={{ backgroundColor: ACCENT }}
                    />
                  )}
                </span>
              </h1>
            </div>
          </div>

          <div className="lg:hidden flex flex-col items-center text-center gap-8">
            <Logo className="w-auto max-w-[320px] sm:max-w-[380px] h-auto object-contain opacity-95" />
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight min-h-[8rem]">
              {typedText.split(",")[0]}
              {typedText.includes(",") && ","}
              {!typedText.includes(",") && (
                <span
                  className={`inline-block w-1 h-12 ml-2 align-middle ${showCursor ? "opacity-100" : "opacity-0"}`}
                  style={{ backgroundColor: ACCENT }}
                />
              )}
              <br />
              {typedText.split(",")[1] || ""}
              {typedText.includes(",") && (
                <span
                  className={`inline-block w-1 h-12 ml-2 align-middle ${showCursor ? "opacity-100" : "opacity-0"}`}
                  style={{ backgroundColor: ACCENT }}
                />
              )}
            </h1>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <svg className="w-6 h-6 text-white/40" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

      <section id="about" className={`${SECTION_Y} px-6 relative`} style={{ backgroundColor: "#000" }}>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12 md:mb-14">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">What is BackDoor?</h3>
            <AccentDivider color={ACCENT} />

            <p className="mt-7 text-base md:text-lg leading-8 text-white/60 max-w-3xl mx-auto font-light">
              2024년 창설된 BackDoor는 사이버 보안을 더 좁고 깊게 공부하고자 하는 학우들이 모여,
              <br />
              보안 내에서도 더 관심 가는 분야를 깊게 파고드는 덕성여자대학교 사이버보안 동아리입니다.
            </p>
          </div>

          <div className="text-center mb-8 md:mb-10">
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight">Core Values</h3>
            <AccentDivider color={ACCENT} />
          </div>
        </div>

        <div className="relative mx-auto max-w-6xl">
          <div className="relative py-6 md:py-8">
            <div className="md:hidden flex flex-col items-center gap-10">
              {coreValues.map((v) => (
                <CoreValueItem key={v.key} v={v} size="sm" />
              ))}
            </div>

            <div className="hidden md:flex items-center justify-center gap-14 lg:gap-24">
              {coreValues.map((v) => (
                <CoreValueItem key={v.key} v={v} size="md" />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="activity" className="pt-14 pb-20 px-6 relative" style={{ backgroundColor: "#000" }}>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-8 md:mb-10">
            <h3 className="text-3xl md:text-4xl font-bold mb-2">Activity</h3>
            <AccentDivider color={ACCENT} />
          </div>

          <div className="mb-7">
            <div className="flex justify-center">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {years.map((y) => (
                  <button
                    key={y}
                    onClick={() => setActiveYear(y)}
                    className={`focus-accent whitespace-nowrap px-4 py-2 rounded-full text-sm border transition-all ${
                      activeYear === y ? "text-black" : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white"
                    }`}
                    style={{
                      backgroundColor: activeYear === y ? ACCENT : undefined,
                      borderColor: activeYear === y ? `${ACCENT}` : "rgba(255,255,255,0.10)",
                    }}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-9">
            <div className="flex justify-center">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {categories.map((c) => {
                  const Icon = getActivityIconByKey(c.iconKey);
                  const selected = activeCategory === c.key;

                  return (
                    <button
                      key={c.key}
                      onClick={() => setActiveCategory(c.key)}
                      className={`focus-accent whitespace-nowrap px-4 py-2 rounded-full text-sm border transition-all flex items-center gap-2 ${
                        selected ? "text-black" : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white"
                      }`}
                      style={{
                        backgroundColor: selected ? ACCENT : undefined,
                        borderColor: selected ? `${ACCENT}` : "rgba(255,255,255,0.10)",
                      }}
                    >
                      <Icon className="h-4 w-4" />
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="px-2 md:px-4 py-2">
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar justify-center">
              {filteredItems.map((item, idx) => {
                const categoryIconKey = categories.find((c) => c.key === item.category)?.iconKey;
                const Icon = getActivityIconByKey(item.iconKey || categoryIconKey);

                return (
                  <div key={`${item.year}-${item.title}-${idx}`} className="relative flex-shrink-0 group">
                    <div className="flex flex-col items-center justify-center px-4 py-3 rounded-xl transition-all hover:translate-y-[-2px]">
                      {item.iconUrl ? (
                        <img src={item.iconUrl} alt="icon" className="h-7 w-7 mb-2 object-contain" />
                      ) : (
                        <Icon className="h-7 w-7 mb-2" style={{ color: ACCENT }} />
                      )}
                      <p className="text-sm font-medium text-white/85 text-center whitespace-nowrap">{item.title}</p>
                    </div>

                    {item.href && (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute -top-2 -right-2 flex items-center justify-center w-7 h-7 rounded-full bg-black/60 border border-white/15 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="open link"
                      >
                        <ArrowUpRight className="h-4 w-4" style={{ color: ACCENT }} />
                      </a>
                    )}
                  </div>
                );
              })}

              {filteredItems.length === 0 && (
                <div className="py-10 px-2 text-center text-white/55 w-full">
                  <p className="text-sm">해당 연도/카테고리에 표시할 활동이 아직 없어요.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="recruit" className={`${SECTION_Y} px-6 relative`} style={{ backgroundColor: "#000" }}>
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Recruit</h2>
            <AccentDivider color={ACCENT} />
          </div>

          <div className="relative overflow-hidden rounded-[28px] border" style={{ borderColor: "rgba(255,255,255,0.12)", background: "linear-gradient(135deg, rgba(243,165,55,0.14), rgba(255,255,255,0.04) 45%, rgba(0,0,0,0.4))" }}>
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full" style={{ background: "radial-gradient(circle, rgba(243,165,55,0.28), transparent 70%)" }} />
            <div className="absolute -left-24 -bottom-24 h-64 w-64 rounded-full" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.12), transparent 70%)" }} />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-8 p-8 md:p-12">
              <div className="flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs" style={{ borderColor: "rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.75)" }}>
                    모집 소식
                    <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
                  </div>
                  <h3 className="mt-4 text-2xl md:text-3xl font-bold tracking-tight text-white/95">
                    {recruit.bannerTitle || "Coming Soon"}
                  </h3>
                  {recruit.bannerDesc ? (
                    <p className="mt-4 text-white/70 whitespace-pre-line leading-relaxed max-w-xl">
                      {recruit.bannerDesc}
                    </p>
                  ) : (
                    <p className="mt-4 text-white/55 text-sm md:text-base">
                      모집 공지와 지원 링크가 준비되면 이곳에 업데이트됩니다.
                    </p>
                  )}
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  {recruit.applyLink ? (
                    <a href={recruit.applyLink} target="_blank" rel="noreferrer">
                      <Button className="text-black hover:opacity-90" style={{ backgroundColor: ACCENT }}>
                        지원 링크 열기 →
                      </Button>
                    </a>
                  ) : (
                    <div className="text-xs text-white/50">지원 링크 준비 중</div>
                  )}
                  <div className="text-xs text-white/50">문의: SNS 또는 Q&A</div>
                </div>
              </div>

              <div className="rounded-2xl border p-4 md:p-5 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1" style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.35)" }}>
                <div className="text-sm font-semibold text-white/85">모집 안내</div>
                <div className="mt-4 rounded-2xl border overflow-hidden" style={{ borderColor: "rgba(255,255,255,0.10)", background: "rgba(0,0,0,0.30)" }}>
                  {recruit.bannerImage ? (
                    <div className="w-full aspect-[16/9] bg-black/40">
                      <img src={recruit.bannerImage} alt="Recruit banner" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-full aspect-[16/9] flex items-center justify-center text-white/45 text-sm">
                      배너 이미지 준비 중
                    </div>
                  )}
                </div>
                <div className="mt-4 text-xs text-white/60 leading-relaxed">
                  지원 일정, 대상, 활동 내용 등을 확인할 수 있습니다.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="qa" className={`${SECTION_Y} px-6 relative`} style={{ backgroundColor: "#000" }}>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-8 md:mb-10">
            <h3 className="text-3xl md:text-4xl font-bold mb-2">FAQ</h3>
            <AccentDivider color={ACCENT} />
          </div>

          <div className="mx-auto w-full max-w-[520px]">
            <div className="space-y-4">
              {faqItems.map((item, idx) => {
                const open = idx === activeFaqIdx;

                return (
                  <div key={item.id ?? item.question ?? idx} className="w-full">
                    <button
                      onClick={() => setActiveFaqIdx((prev) => (prev === idx ? null : idx))}
                      className="w-full text-left rounded-2xl px-5 py-4 transition-all border flex items-center justify-between gap-4"
                      style={{
                        backgroundColor: open ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.06)",
                        borderColor: open ? `${ACCENT}CC` : "rgba(255,255,255,0.10)",
                        boxShadow: open ? `0 0 0 1px ${ACCENT}22` : "none",
                      }}
                    >
                      <span className="text-white/90 text-sm md:text-base">{item.question}</span>
                      <span
                        className={`text-white/50 text-xl leading-none transition-transform ${open ? "rotate-45" : "rotate-0"}`}
                        style={{ color: open ? ACCENT : "rgba(255,255,255,0.55)" }}
                      >
                        +
                      </span>
                    </button>

                    <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}>
                      <div
                        className="mt-3 rounded-2xl border px-5 py-4 bg-white/5"
                        style={{ borderColor: open ? `${ACCENT}CC` : "rgba(255,255,255,0.10)" }}
                      >
                        <p className="text-white/80 text-sm md:text-base leading-relaxed whitespace-pre-line">{item.answer}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8">
              <a href="https://open.kakao.com/" target="_blank" rel="noreferrer" className="block">
                <button className="w-full rounded-2xl py-4 font-semibold text-black transition-all hover:opacity-90" style={{ backgroundColor: ACCENT }}>
                  New Question?
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-10 px-6" style={{ backgroundColor: "#000" }}>
        <div className="max-w-7xl mx-auto text-center text-sm text-white/50">
          © 2026 BackDoor. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
