"use client";

import { useEffect, useState } from "react";

/* ── Marca SVG animada (rede neural "nodo") ── */
function Mark({ uid, size = 24, animated = true }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`g-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="45%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id={`g2-${uid}`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
        <radialGradient id={`core-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#4f46e5" />
        </radialGradient>
      </defs>
      <path
        className={animated ? "qa-mark-draw" : ""}
        d="M9 33 L18 24 L27 28 L39 13"
        stroke={`url(#g-${uid})`}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle className={animated ? "qa-mark-node qa-mark-node-1" : ""} cx="9" cy="33" r="3.4" fill={`url(#g2-${uid})`} />
      <circle className={animated ? "qa-mark-node qa-mark-node-2" : ""} cx="18" cy="24" r="3" fill={`url(#g-${uid})`} />
      <circle className={animated ? "qa-mark-node qa-mark-node-3" : ""} cx="27" cy="28" r="3" fill={`url(#g2-${uid})`} />
      <circle className={animated ? "qa-mark-node qa-mark-node-4" : ""} cx="39" cy="13" r="4" fill={`url(#core-${uid})`} />
    </svg>
  );
}

const ARROW = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const CHECK = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const MAIL = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const MARQUEE_ITEMS = [
  "INFOPRODUTOS",
  "CURSOS ONLINE",
  "MARKETING DIGITAL",
  "PLATAFORMAS PRÓPRIAS",
  "EDUCAÇÃO ONLINE",
  "DISTRIBUIÇÃO DIGITAL",
];

function MarqueeRow({ hidden }) {
  return (
    <div className="flex items-center" aria-hidden={hidden ? "true" : undefined}>
      {MARQUEE_ITEMS.map((t, i) => (
        <span key={i} className="flex items-center gap-2 px-6">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          <span className="text-[12px] font-semibold tracking-wider text-slate-500">{t}</span>
        </span>
      ))}
    </div>
  );
}

const PILLARS = [
  {
    title: "Criação",
    grad: "from-indigo-500 to-violet-600",
    shadow: "rgba(99,102,241,.6)",
    desc: "Desenvolvemos infoprodutos e conteúdos educacionais originais, com curadoria de temas, roteiro e produção pensados para gerar valor real.",
    icon: (
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z" />
    ),
  },
  {
    title: "Comercialização",
    grad: "from-violet-500 to-fuchsia-600",
    shadow: "rgba(139,92,246,.6)",
    desc: "Levamos os produtos ao mercado com estratégias de marketing digital, funis de venda e aquisição de tráfego orientada a performance.",
    icon: (
      <>
        <path d="m3 11 18-5v12L3 14v-3z" />
        <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
      </>
    ),
  },
  {
    title: "Distribuição",
    grad: "from-cyan-500 to-blue-600",
    shadow: "rgba(6,182,212,.6)",
    desc: "Entregamos através de plataformas próprias, com acesso imediato, escala internacional e experiência do usuário como prioridade.",
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </>
    ),
  },
];

const SOLUTIONS = [
  {
    title: "Infoprodutos",
    desc: "E-books, guias, mentorias e produtos digitais que empacotam conhecimento de forma prática e acessível.",
    icon: <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />,
  },
  {
    title: "Conteúdos educacionais",
    desc: "Cursos e trilhas de aprendizado online, com linguagem simples e foco em resultado para quem está começando.",
    icon: (
      <>
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </>
    ),
  },
  {
    title: "Plataformas próprias",
    desc: "Infraestrutura tecnológica desenvolvida internamente para hospedar, entregar e escalar os produtos com segurança.",
    icon: (
      <>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </>
    ),
  },
  {
    title: "Marketing digital",
    desc: "Aquisição de tráfego, funis de conversão e otimização contínua para conectar cada produto ao público certo.",
    icon: (
      <>
        <path d="m3 11 18-5v12L3 14v-3z" />
        <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
      </>
    ),
  },
];

const DIFERENCIAIS = [
  ["Ciclo completo", "criação, venda e entrega sob o mesmo teto."],
  ["Plataformas próprias", "sem depender de terceiros para escalar."],
  ["Marketing data-driven", "decisões baseadas em métricas reais."],
  ["Alcance latino", "conteúdo adaptado à realidade do mercado."],
];

const MERCADO = [
  ["🌎 LatAm", "Público-alvo em toda a América Latina"],
  ["100% Online", "Entrega digital, acesso imediato"],
  ["Espanhol", "Conteúdo no idioma do cliente"],
  ["24/7", "Disponível a qualquer hora"],
];

const VALORES = [
  {
    title: "Missão",
    grad: "from-indigo-500 to-violet-600",
    desc: "Democratizar o acesso ao conhecimento através de produtos digitais de qualidade, acessíveis e transformadores.",
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </>
    ),
  },
  {
    title: "Visão",
    grad: "from-violet-500 to-fuchsia-600",
    desc: "Ser referência em educação digital na América Latina, unindo tecnologia própria e conteúdo relevante em escala.",
    icon: (
      <>
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
  },
  {
    title: "Valores",
    grad: "from-cyan-500 to-blue-600",
    desc: "Transparência, inovação, foco no cliente e compromisso com a entrega de valor real em cada produto.",
    icon: <path d="M12 2 4 5v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V5z" />,
  },
];

const NAV_LINKS = [
  ["#empresa", "A empresa"],
  ["#solucoes", "Soluções"],
  ["#mercado", "Mercado"],
  ["#valores", "Valores"],
  ["#contato", "Contato"],
];

export default function DigitalisPage() {
  const [scrolled, setScrolled] = useState(false);
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(String(new Date().getFullYear()));

    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <>
      {/* ═══════════════ FUNDO AURORA ═══════════════ */}
      <div className="fixed inset-0 pointer-events-none -z-10 aurora-gradient" />
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="qa-blob qa-blob-a" />
        <div className="qa-blob qa-blob-b" />
        <div className="qa-blob qa-blob-c" />
      </div>
      <div className="fixed inset-0 pointer-events-none -z-10 aurora-grid" />
      <div className="qa-noise fixed inset-0 pointer-events-none -z-10" />

      {/* ═══════════════ NAVBAR ═══════════════ */}
      <header className="fixed top-0 inset-x-0 z-50">
        <div className="max-w-6xl mx-auto px-5">
          <div
            className={`mt-3 rounded-2xl qa-glass px-4 sm:px-5 py-3 flex items-center justify-between transition-shadow duration-300 ${
              scrolled ? "shadow-lg" : ""
            }`}
          >
            <a href="#top" className="flex items-center gap-2.5">
              <span className="w-10 h-10 rounded-xl bg-white/70 border border-white/70 flex items-center justify-center shadow-sm">
                <Mark uid="nav" size={24} />
              </span>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 leading-none">
                Digitalis <span className="text-slate-400 font-semibold">Infoproducts</span>
              </span>
            </a>

            <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
              {NAV_LINKS.map(([href, label]) => (
                <a key={href} href={href} className="hover:text-indigo-600 transition-colors">
                  {label}
                </a>
              ))}
            </nav>

            <a
              href="#contato"
              className="relative overflow-hidden rounded-xl px-4 py-2.5 text-sm font-bold text-white flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 shadow-[0_12px_28px_-10px_rgba(99,102,241,.6)] active:scale-95 transition"
            >
              <span className="qa-shine" />
              <span className="relative z-10">Fale conosco</span>
            </a>
          </div>
        </div>
      </header>

      <main id="top" className="relative">
        {/* ═══════════════ HERO ═══════════════ */}
        <section className="pt-36 sm:pt-40 pb-20 px-5">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full qa-glass-soft mb-6 qa-rise">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-600 text-xs font-semibold tracking-wide">
                PRODUTOS DIGITAIS · EDUCAÇÃO ONLINE · MERCADO LATINO
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black leading-[1.08] tracking-tight text-slate-900 qa-rise qa-d1">
              Transformamos conhecimento em <span className="gradient-text">produtos digitais</span> que educam e escalam
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto qa-rise qa-d2">
              A <strong className="text-slate-700 font-semibold">Digitalis Infoproducts</strong> cria, comercializa e
              distribui infoprodutos e conteúdos educacionais online, através de plataformas próprias e marketing digital,
              atendendo clientes em toda a América Latina.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5 qa-rise qa-d3">
              <a
                href="#contato"
                className="relative overflow-hidden w-full sm:w-auto rounded-2xl px-8 py-4 text-lg font-bold text-white flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 shadow-[0_18px_40px_-10px_rgba(99,102,241,.6)] active:scale-[.98] transition"
              >
                <span className="qa-shine" />
                <span className="relative z-10 flex items-center gap-3">
                  Seja um parceiro
                  {ARROW}
                </span>
              </a>
              <a
                href="#solucoes"
                className="w-full sm:w-auto rounded-2xl px-8 py-4 text-lg font-bold text-slate-700 flex items-center justify-center gap-2 qa-glass active:scale-[.98] transition"
              >
                Conheça as soluções
              </a>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-3 max-w-2xl mx-auto qa-rise qa-d4">
              {[
                ["100%", "Digital & escalável"],
                ["LatAm", "Foco no mercado latino"],
                ["LLC", "Estrutura internacional"],
              ].map(([big, small]) => (
                <div key={big} className="qa-glass-soft rounded-2xl py-4">
                  <div className="text-2xl sm:text-3xl font-black gradient-text qa-tnum">{big}</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">{small}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ MARQUEE ═══════════════ */}
        <section className="px-5 pb-4">
          <div className="max-w-6xl mx-auto">
            <div className="qa-glass-soft rounded-full overflow-hidden py-3 relative">
              <div
                className="absolute inset-y-0 left-0 w-16 z-10 pointer-events-none"
                style={{ background: "linear-gradient(90deg,rgba(255,255,255,.9),transparent)" }}
              />
              <div
                className="absolute inset-y-0 right-0 w-16 z-10 pointer-events-none"
                style={{ background: "linear-gradient(270deg,rgba(255,255,255,.9),transparent)" }}
              />
              <div className="qa-marquee-track">
                <MarqueeRow />
                <MarqueeRow hidden />
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ A EMPRESA / 3 PILARES ═══════════════ */}
        <section id="empresa" className="py-20 px-5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 reveal">
              <p className="text-[11px] font-bold tracking-widest text-indigo-500 mb-2">A EMPRESA</p>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                Uma operação digital de ponta a ponta
              </h2>
              <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
                Cuidamos de todo o ciclo do produto digital — da ideia à entrega ao cliente final — com tecnologia própria
                e estratégia de aquisição.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-5">
              {PILLARS.map((p, i) => (
                <div key={p.title} className="qa-glass rounded-3xl p-7 reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${p.grad} flex items-center justify-center`}
                    style={{ boxShadow: `0 14px 30px -10px ${p.shadow}` }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {p.icon}
                    </svg>
                  </div>
                  <h3 className="mt-5 text-xl font-black text-slate-900">{p.title}</h3>
                  <p className="mt-2 text-slate-500 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ SOLUÇÕES ═══════════════ */}
        <section id="solucoes" className="py-20 px-5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 reveal">
              <p className="text-[11px] font-bold tracking-widest text-indigo-500 mb-2">O QUE OFERECEMOS</p>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">Soluções digitais completas</h2>
              <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
                Um portfólio pensado para educar, engajar e converter — do primeiro contato ao acesso ao conteúdo.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {SOLUTIONS.map((s, i) => (
                <div
                  key={s.title}
                  className="qa-glass-soft rounded-3xl p-7 flex items-start gap-5 reveal"
                  style={{ transitionDelay: `${(i % 2) * 0.06}s` }}
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-100 flex items-center justify-center flex-shrink-0 border border-white">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {s.icon}
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{s.title}</h3>
                    <p className="text-slate-500 mt-1 text-[15px] leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ DIFERENCIAIS ═══════════════ */}
        <section className="py-10 px-5">
          <div className="max-w-6xl mx-auto">
            <div className="qa-glass rounded-3xl p-8 sm:p-10 relative overflow-hidden reveal">
              <div
                className="absolute -top-16 -right-16 w-64 h-64 rounded-full"
                style={{ background: "radial-gradient(circle,rgba(99,102,241,.18),transparent 70%)" }}
              />
              <div className="relative grid sm:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-[11px] font-bold tracking-widest text-indigo-500 mb-2">POR QUE A DIGITALIS</p>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                    Tecnologia própria, foco em performance e escala internacional
                  </h2>
                  <p className="text-slate-500 mt-3 leading-relaxed">
                    Combinamos criação de conteúdo, engenharia de plataformas e marketing orientado a dados para operar
                    produtos digitais com previsibilidade e eficiência.
                  </p>
                </div>
                <ul className="space-y-4">
                  {DIFERENCIAIS.map(([strong, rest]) => (
                    <li key={strong} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        {CHECK}
                      </span>
                      <span className="text-slate-700">
                        <strong className="font-semibold text-slate-800">{strong}</strong> — {rest}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ MERCADO ═══════════════ */}
        <section id="mercado" className="py-20 px-5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 reveal">
              <p className="text-[11px] font-bold tracking-widest text-indigo-500 mb-2">NOSSO MERCADO</p>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">Feito para a América Latina</h2>
              <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
                Atuamos principalmente em países latinos, com produtos e comunicação adaptados à cultura, ao idioma e às
                necessidades do público regional.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {MERCADO.map(([big, small], i) => (
                <div key={big} className="qa-glass-soft rounded-2xl p-6 text-center reveal" style={{ transitionDelay: `${i * 0.06}s` }}>
                  <div className="text-2xl font-black gradient-text">{big}</div>
                  <p className="text-slate-500 text-sm mt-2">{small}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ MISSÃO / VISÃO / VALORES ═══════════════ */}
        <section id="valores" className="py-20 px-5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 reveal">
              <p className="text-[11px] font-bold tracking-widest text-indigo-500 mb-2">NOSSA ESSÊNCIA</p>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">Missão, visão e valores</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {VALORES.map((v, i) => (
                <div key={v.title} className="qa-glass rounded-3xl p-7 reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${v.grad} flex items-center justify-center`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {v.icon}
                    </svg>
                  </div>
                  <h3 className="mt-5 text-lg font-black text-slate-900">{v.title}</h3>
                  <p className="mt-2 text-slate-500 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ CTA / CONTATO ═══════════════ */}
        <section id="contato" className="py-20 px-5">
          <div className="max-w-4xl mx-auto">
            <div className="qa-glass rounded-[32px] p-8 sm:p-12 text-center relative overflow-hidden reveal">
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%,rgba(99,102,241,.12),transparent 70%)" }}
              />
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl qa-glass flex items-center justify-center mx-auto mb-5">
                  <Mark uid="cta" size={34} />
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                  Vamos construir algo <span className="gradient-text">digital</span> juntos
                </h2>
                <p className="text-slate-500 mt-3 max-w-xl mx-auto text-lg">
                  Interessado em parcerias, distribuição ou colaboração de conteúdo? Fale com a nossa equipe.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                  <a
                    href="mailto:contato@digitalisinfoproducts.com"
                    className="relative overflow-hidden w-full sm:w-auto rounded-2xl px-8 py-4 text-lg font-bold text-white flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 shadow-[0_18px_40px_-10px_rgba(99,102,241,.6)] active:scale-[.98] transition"
                  >
                    <span className="qa-shine" />
                    <span className="relative z-10 flex items-center gap-3">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                      Enviar e-mail
                    </span>
                  </a>
                  <a
                    href="#top"
                    className="w-full sm:w-auto rounded-2xl px-8 py-4 text-lg font-bold text-slate-700 flex items-center justify-center gap-2 qa-glass-soft active:scale-[.98] transition"
                  >
                    Voltar ao topo
                  </a>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-slate-500 text-sm">
                  <span className="flex items-center gap-2">{MAIL} contato@digitalisinfoproducts.com</span>
                  <span className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    Estados Unidos · Operação 100% remota
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="px-5 pb-10">
        <div className="max-w-6xl mx-auto">
          <div className="qa-glass-soft rounded-3xl p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-xl bg-white/70 border border-white/70 flex items-center justify-center shadow-sm">
                  <Mark uid="ft" size={26} animated={false} />
                </span>
                <div>
                  <div className="font-extrabold text-slate-900 leading-none">Digitalis Infoproducts</div>
                  <div className="text-slate-400 text-sm mt-1">Produtos digitais &amp; educação online</div>
                </div>
              </div>

              <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-slate-500">
                {NAV_LINKS.map(([href, label]) => (
                  <a key={href} href={href} className="hover:text-indigo-600 transition-colors">
                    {label}
                  </a>
                ))}
              </nav>
            </div>

            <div className="h-px bg-slate-200/70 my-7" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-slate-400 text-xs">
              <p>© {year} Digitalis Infoproducts LLC. Todos os direitos reservados.</p>
              <p>Empresa registrada nos Estados Unidos (LLC) · Operação digital com atuação na América Latina.</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
