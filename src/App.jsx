import { useEffect, useRef, useState } from 'react'
import Modalities from './Modalities.jsx'
import Plans from './Plans.jsx'
import { useSiteEffects } from './effects.js'

/* ---------- contato ----------
   Preencha PHONE com DDI + DDD + número (ex.: '5521999999999') para os botões abrirem o WhatsApp.
   Enquanto estiver vazio, todos os botões levam ao direct do Instagram. */
const PHONE = ''
const INSTAGRAM = 'personal_danilo.almeida89'
const CREF = 'CREF 063920-G/RJ'
const COMPANY = 'Infinite Esportes'
const COMPANY_IG = 'infinite_esportes'
const COMPANY_CREF = 'CREF 006507-PJ/RJ'
const COMPANY_IG_HREF = `https://www.instagram.com/${COMPANY_IG}/`

const WA_TEXT = 'Olá, Danilo! Vi seu site e gostaria de saber mais sobre os treinos.'
const CONTACT_HREF = PHONE
  ? `https://wa.me/${PHONE}?text=${encodeURIComponent(WA_TEXT)}`
  : `https://ig.me/m/${INSTAGRAM}`
const INSTAGRAM_HREF = `https://www.instagram.com/${INSTAGRAM}/`
const planHref = (plan) => PHONE
  ? `https://wa.me/${PHONE}?text=${encodeURIComponent(`Olá, Danilo! Tenho interesse no plano "${plan}".`)}`
  : CONTACT_HREF
const CONTACT_LABEL = PHONE ? 'WhatsApp' : 'Instagram'

/* ---------- hooks ---------- */

/* esconde o botão flutuante enquanto ele ficaria sobre conteúdo interativo (mobile, ver CSS) */
function useFloatHide() {
  const [hide, setHide] = useState(false)
  useEffect(() => {
    const targets = document.querySelectorAll('.faq, #contato, .footer')
    const seen = new Set()
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)))
        setHide(seen.size > 0)
      },
      { rootMargin: '0px 0px -10% 0px' }
    )
    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [])
  return hide
}

function useCount(target, start) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!start) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return setV(target)
    let raf
    const t0 = performance.now()
    const dur = 1400
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1)
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, start])
  return v
}

/* ---------- small components ---------- */
function Stat({ n, text, label }) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()), { threshold: 0.4 })
    ref.current && io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  const v = useCount(n ?? 0, seen && n != null)
  return (
    <div className="stat" ref={ref}>
      <strong className={n == null ? "stat__text" : undefined}>{n != null ? v : text}</strong>
      <span>{label}</span>
    </div>
  )
}

const Btn = ({ href, children, variant = 'solid', className = '', external = false, ...p }) => (
  <a className={`btn btn--${variant} ${className}`.trim()} href={href}
    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...p}>
    {children}
  </a>
)

/* uma linha mascarada do título do hero */
const Ln = ({ i, className = '', children }) => (
  <span className={`ln ${className}`}>
    <span style={{ '--i': i }}>{children}</span>
  </span>
)

function Brand() {
  return (
    <span className="brand">
      <img className="brand__logo" src="img/infinite-logo-240.webp" alt="" width="40" height="40" />
      <span className="brand__text">
        <span className="brand__name">Danilo Almeida</span>
        <span className="brand__role">Personal Trainer</span>
      </span>
    </span>
  )
}

/* ---------- data ---------- */
const focusAreas = ['Musculação', 'Funcional', 'Hidroginástica', 'Natação', 'Recreação infantil']

const problems = [
  { title: 'Começar do zero', text: 'O treino parte do seu nível atual, com progressão gradual e orientação em cada exercício.' },
  { title: 'Treinar com mais conforto', text: 'Na piscina, o treino tem menos impacto e permite trabalhar o corpo todo com leveza.' },
  { title: 'Crianças aprendem brincando', text: 'Natação e recreação infantil com atenção, segurança e muita atividade.' },
  { title: 'Rotina corrida', text: 'Cada sessão tem um objetivo claro, para você aproveitar bem o tempo que tem.' },
]

const method = [
  { title: 'Entender seu objetivo', text: 'Sua rotina, seu histórico e suas metas orientam cada escolha de treino.' },
  { title: 'Treinar com técnica', text: 'Atenção à execução, à postura e à segurança, na academia ou na piscina.' },
  { title: 'Evoluir com constância', text: 'O acompanhamento se ajusta ao seu progresso, no seu ritmo.' },
]

const trainingAreas = [
  {
    title: 'Musculação e treinamento funcional: força para o dia a dia',
    subtitle: 'Treino orientado para ganhar força, condicionamento e autonomia.',
    paragraphs: [
      'A musculação ajuda a desenvolver força e massa muscular, e o treinamento funcional trabalha movimentos que fazem parte da rotina, como agachar, empurrar, puxar e se equilibrar.',
      'Com acompanhamento, o treino é organizado conforme seu objetivo, seu nível e suas possibilidades, com atenção à técnica de cada exercício.',
    ],
    question: 'Para quem é indicado?',
    answer: 'Para quem está começando, quer retomar a rotina de treinos ou busca evoluir em força, condicionamento e composição corporal. O planejamento considera o histórico e as necessidades de cada pessoa.',
  },
  {
    title: 'Ginástica localizada e alongamento: corpo ativo e flexível',
    subtitle: 'Trabalho muscular dirigido e cuidado com a amplitude de movimento.',
    paragraphs: [
      'A ginástica localizada trabalha grupos musculares específicos com exercícios de repetição, ajudando na resistência e no tônus muscular.',
      'O alongamento complementa o treino, contribuindo para a mobilidade e para uma sensação de mais soltura no corpo.',
    ],
    question: 'Posso fazer junto com outras modalidades?',
    answer: 'Sim. Essas atividades combinam bem com a musculação, o funcional e as aulas na piscina. O Danilo ajuda a montar uma rotina equilibrada.',
  },
  {
    title: 'Hidroginástica e natação: movimento na água',
    subtitle: 'Aulas na piscina para crianças e adultos.',
    paragraphs: [
      'A hidroginástica é feita em grupo, com materiais como espaguetes e flutuadores, e a água oferece resistência com menos impacto sobre as articulações.',
      'Na natação, infantil e adulta, o foco é aprender, ganhar confiança na água e melhorar a técnica, com orientação próxima durante a aula.',
    ],
    question: 'Preciso saber nadar para fazer hidroginástica?',
    answer: 'Em geral, as aulas de hidroginástica são feitas em piscina rasa, onde se apoia no chão. Converse com o Danilo para combinar o melhor formato para o seu caso.',
  },
  {
    title: 'Recreação infantil, futebol e futsal: aprender se divertindo',
    subtitle: 'Atividades para crianças e jogos em equipe.',
    paragraphs: [
      'A recreação infantil estimula a coordenação, a socialização e o gosto pelo movimento por meio de brincadeiras orientadas.',
      'Futebol e futsal trabalham fundamentos do esporte, trabalho em equipe e condicionamento de forma divertida.',
    ],
    question: 'Como funciona o atendimento?',
    answer: 'Horários, faixas de idade e formato (individual ou em grupo) são combinados diretamente com o Danilo, de acordo com a sua necessidade.',
  },
]

const gallery = [
  { id: 'hidro-noite', alt: 'Danilo ao lado da piscina iluminada à noite, com a turma de hidroginástica na água', label: 'Hidroginástica noturna', ratio: 'wide' },
  { id: 'natacao-infantil', alt: 'Aula de natação infantil em piscina coberta, com professor e crianças usando espaguetes', label: 'Natação infantil', ratio: 'wide' },
  { id: 'natacao-adulto', alt: 'Danilo orientando um aluno adulto na beira da piscina', label: 'Natação adulto', ratio: 'tall' },
  { id: 'costas', alt: 'Danilo de costas na academia, com camisa Personal Trainer', label: 'Na academia', ratio: 'wide' },
]

const academyGallery = [
  { id: 'academia-acompanhamento', file: 'academia-acompanhamento.webp', alt: 'Danilo acompanhando uma aluna durante o exercício no aparelho extensor de pernas', label: 'Treino acompanhado', ratio: 'tall' },
  { id: 'academia-aluna', file: 'academia-aluna.webp', alt: 'Danilo ao lado de uma aluna na academia após o treino', label: 'Acompanhamento próximo', ratio: 'tall' },
  { id: 'academia-execucao', file: 'academia-execucao.webp', alt: 'Danilo acompanhando uma aluna durante a execução da puxada na polia', label: 'Técnica em cada movimento', ratio: 'tall' },
  { id: 'academia-orientacao', file: 'academia-orientacao.webp', alt: 'Danilo observando uma aluna em treinamento na academia', label: 'Orientação presencial', ratio: 'tall' },
]

const faq = [
  ['Nunca treinei. Posso começar?', 'Pode. O treino é montado a partir do seu ponto de partida, com progressão gradual e acompanhamento na execução.'],
  ['Tem aula para crianças?', 'Sim. O Danilo atua com natação infantil e recreação infantil. Fale com ele para saber sobre horários e faixas de idade.'],
  ['A hidroginástica é para quem?', 'É uma atividade em grupo, feita na piscina, que trabalha o corpo todo com menos impacto. Converse com o Danilo para saber se é indicada para o seu caso.'],
  ['Como contrato uma consultoria?', `Escolha o plano na seção de planos e mande uma mensagem pelo ${CONTACT_LABEL}. O Danilo confirma disponibilidade e forma de pagamento.`],
]

const links = [
  ['Início', '#inicio'],
  ['Método', '#metodo'],
  ['Atuação', '#atuacao'],
  ['Danilo', '#danilo'],
  ['Galeria', '#galeria'],
  ['Modalidades', '#modalidades'],
  ['Planos', '#planos'],
  ['Dúvidas', '#faq'],
]

/* ---------- sections ---------- */
function Nav() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const f = () => setSolid(window.scrollY > 40)
    f()
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])
  return (
    <header className={`nav ${solid ? 'nav--solid' : ''} ${open ? 'nav--open' : ''}`}>
      <div className="wrap nav__in">
        <a href="#inicio" className="nav__logo nav__brand" onClick={() => setOpen(false)} aria-label="Danilo Almeida, personal trainer — página inicial">
          <Brand />
        </a>
        <nav className="nav__links" aria-label="Principal">
          {links.map(([l, h]) => (
            <a key={h} href={h} onClick={() => setOpen(false)}>{l}</a>
          ))}
          <a className="nav__cta" href={CONTACT_HREF} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>Falar com o Danilo</a>
        </nav>
        <button className="nav__burger" aria-label="Abrir menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <i /><i /><i />
        </button>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero hero--editorial" id="inicio">
      <figure className="hero__photo">
        <img
          src="img/hero-960.webp"
          srcSet="img/hero-800.webp 800w, img/hero-960.webp 960w"
          sizes="(max-width: 960px) 100vw, 66vw"
          alt="Danilo Almeida, personal trainer, na academia com camisa Personal Trainer"
          width="960" height="1280" fetchpriority="high" decoding="async"
        />
      </figure>
      <div className="wrap hero__body">
        <p className="hero__id">Danilo Almeida, personal trainer · {CREF}</p>
        <h1 className="hero__title">
          <Ln i={0}>Academia,</Ln>
          <Ln i={1}>piscina e</Ln>
          <Ln i={2} className="ln--gold">movimento</Ln>
          <Ln i={3} className="ln--sub">para todas as idades</Ln>
        </h1>
        <div className="hero__row">
          <p className="hero__lead">
            Musculação, funcional, hidroginástica e natação com orientação profissional de perto. Treino seguro, objetivo e adaptado ao seu momento, do primeiro dia à rotina.
          </p>
          <div className="hero__btns">
            <Btn href={CONTACT_HREF} external>Quero começar agora</Btn>
            <Btn href="#metodo" variant="ghost">Conhecer o método</Btn>
          </div>
        </div>
      </div>
      <div className="hero__stats">
        <div className="wrap hero__stats-in">
          <Stat n={10} label="modalidades de atuação" />
          <Stat text="Infantil e adulto" label="natação e recreação" />
          <Stat text="Lic. e Bacharel" label="Educação Física" />
        </div>
      </div>
    </section>
  )
}

const marqueeItems = ['Musculação', 'Funcional', 'Hidroginástica', 'Natação infantil e adulto', 'Ginástica localizada', 'Alongamento', 'Recreação infantil', 'Futebol', 'Futsal']

function Marquee() {
  const row = (hidden) => (
    <ul className="marquee__row" aria-hidden={hidden || undefined}>
      {marqueeItems.map((t) => (
        <li key={t}><span>{t}</span><svg viewBox="0 0 48 24" width="34" height="17" aria-hidden="true"><path d="M24 12c-3-5-6-8-10-8a8 8 0 0 0 0 16c4 0 7-3 10-8s6-8 10-8a8 8 0 0 1 0 16c-4 0-7-3-10-8z" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"/></svg></li>
      ))}
    </ul>
  )
  return (
    <section className="marquee" aria-label="Áreas de atuação">
      <div className="marquee__track">{row(false)}{row(true)}</div>
    </section>
  )
}

function FocusAreas() {
  return (
    <section className="focus-strip" aria-label="Áreas de atuação">
      <div className="wrap focus-strip__inner">
        <p className="focus-strip__eyebrow">TREINAMENTO COM PROPÓSITO</p>
        <ul className="focus-strip__list">
          {focusAreas.map((area) => <li key={area}>{area}</li>)}
        </ul>
      </div>
    </section>
  )
}

function Problem() {
  return (
    <section className="sec problem" id="porque">
      <div className="wrap">
        <h2 className="h2">Cada pessoa, cada fase: o treino certo muda tudo</h2>
        <p className="problem__sub">Seja para ganhar força, perder o medo da água ou simplesmente se mexer mais, o acompanhamento faz a diferença.</p>
        <div className="rows">
          {problems.map((p, i) => (
            <article className="row" key={p.title}>
              <span className="row__number" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Method() {
  return (
    <section className="sec method" id="metodo">
      <div className="wrap">
        <div className="method__head">
          <h2 className="h2">Treino pensado para o seu objetivo</h2>
          <p>Sem fórmulas prontas: um caminho simples, com técnica, segurança e acompanhamento do início ao fim.</p>
        </div>
        <ol className="steps">
          {method.map((m, i) => (
            <li key={m.title}>
              <span className="steps__number" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <h3>{m.title}</h3>
              <p>{m.text}</p>
            </li>
          ))}
        </ol>
        <div className="method__cta">
          <Btn href={CONTACT_HREF} external>Começar meu acompanhamento</Btn>
        </div>
      </div>
    </section>
  )
}

function TrainingAreas() {
  const [open, setOpen] = useState(null)
  return (
    <section className="sec training-areas" id="atuacao" aria-labelledby="training-areas-title">
      <div className="wrap">
        <div className="training-areas__head">
          <p className="training-areas__eyebrow">ÁREAS DE ATUAÇÃO</p>
          <h2 className="h2" id="training-areas-title">Um caminho para cada objetivo</h2>
          <p>Conheça as modalidades e entenda como cada uma pode entrar na sua rotina.</p>
        </div>
        <div className="training-areas__list">
          {trainingAreas.map((area, i) => (
            <article className={`training-areas__item ${open === i ? 'is-open' : ''}`} key={area.title}>
              <div className="training-areas__summary">
                <span className="training-areas__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <div className="training-areas__copy">
                  <h3>{area.title}</h3>
                  <p>{area.subtitle}</p>
                </div>
                <button type="button" className="training-areas__toggle"
                  aria-expanded={open === i}
                  aria-controls={`training-area-${i}`}
                  onClick={() => setOpen(open === i ? null : i)}>
                  <span>{open === i ? 'Mostrar menos' : 'Saiba mais'}</span>
                  <span aria-hidden="true">{open === i ? '−' : '+'}</span>
                </button>
              </div>
              <div id={`training-area-${i}`} className="training-areas__detail" hidden={open !== i}>
                {area.paragraphs.map((text) => <p key={text}>{text}</p>)}
                <h4>{area.question}</h4>
                <p>{area.answer}</p>
                <Btn href={CONTACT_HREF} variant="ghost" external>Falar com o Danilo</Btn>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="sec about" id="danilo">
      <div className="wrap about__grid">
        <figure className="about__photo">
          <div className="clip"><img src="img/piscina-lateral-800.webp" alt="Danilo Almeida à beira da piscina, de camisa azul Personal Trainer" width="800" height="1422" loading="lazy" decoding="async" /></div>
          <figcaption>{CREF}</figcaption>
        </figure>
        <div className="about__copy">
          <h2 className="h2">Educação Física que acompanha você de perto</h2>
          <p className="about__text">Danilo Almeida atua em várias frentes do movimento: da musculação ao funcional, da hidroginástica à natação, passando pela recreação infantil, pelo futebol e pelo futsal. O objetivo é o mesmo em todas: treino com técnica, segurança e atenção ao aluno.</p>
          <ul className="creds">
            <li><strong>Licenciado e Bacharel</strong><p>Formação em Educação Física, com atuação em academia, piscina e esporte.</p></li>
            <li><strong>{CREF}</strong><p>Registro profissional no Conselho Regional de Educação Física.</p></li>
          </ul>
          <a className="company" href={COMPANY_IG_HREF} target="_blank" rel="noopener noreferrer" aria-label={`${COMPANY} no Instagram`}>
            <img className="company__logo" src="img/infinite-logo-240.webp" alt={`Logo da ${COMPANY}`} width="72" height="72" loading="lazy" decoding="async" />
            <span className="company__text">
              <span className="company__eyebrow">PROPRIETÁRIO</span>
              <strong>{COMPANY}</strong>
              <span>Assessoria esportiva · {COMPANY_CREF}</span>
              <span className="company__ig">@{COMPANY_IG} ↗</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}

function Gallery() {
  const galleryCard = (g, index) => (
    <figure key={g.id} className={`moments__item moments__item--${g.ratio} moments__item--${g.id}`}>
      <img
        src={`img/${g.file ?? `${g.id}-800.webp`}`}
        alt={g.alt} loading="lazy" decoding="async"
      />
      <figcaption className="gallery__caption">
        <span>{String(index + 1).padStart(2, '0')}</span>
        <span>{g.label}</span>
      </figcaption>
    </figure>
  )

  return (
    <section className="sec gallery-sec" id="galeria">
      <div className="wrap">
        <h2 className="h2">Na academia e na piscina</h2>
        <div className="moments moments--overview">
          {gallery.map((g, i) => galleryCard(g, i))}
          <div className="moments__cta">
            <p className="moments__eyebrow">ACOMPANHE NO INSTAGRAM</p>
            <h3>Mais treinos, aulas e bastidores.</h3>
            <Btn href={INSTAGRAM_HREF} external>@{INSTAGRAM} ↗</Btn>
          </div>
        </div>

        <div className="gallery-training__intro">
          <p className="gallery-training__eyebrow">MUSCULAÇÃO COM ACOMPANHAMENTO</p>
          <h3>Treino de perto, em cada movimento.</h3>
        </div>
        <div className="moments moments--training">
          {academyGallery.map((g, i) => galleryCard(g, gallery.length + i))}
        </div>
      </div>
    </section>
  )
}

function Faq() {
  const [open, setOpen] = useState(-1)
  return (
    <section className="sec faq-sec" id="faq">
      <div className="wrap faq-sec__grid">
        <div className="faq-sec__head">
          <h2 className="h2">Dúvidas frequentes</h2>
          <p>Ficou com alguma dúvida? Fale direto com o Danilo.</p>
          <Btn href={CONTACT_HREF} variant="ghost" external>Tirar minha dúvida</Btn>
        </div>
        <div className="faq">
          {faq.map(([q, a], i) => (
            <div className={`faq__item ${open === i ? 'is-open' : ''}`} key={q}>
              <button id={`faq-b-${i}`} aria-expanded={open === i} aria-controls={`faq-p-${i}`} onClick={() => setOpen(open === i ? -1 : i)}>
                <span>{q}</span><b aria-hidden="true" />
              </button>
              <div className="faq__panel" id={`faq-p-${i}`} role="region" aria-labelledby={`faq-b-${i}`}>
                <div><p>{a}</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="final" id="contato">
      <div className="wrap final__grid">
        <div className="final__copy">
          <p className="final__eyebrow">SEU PRÓXIMO PASSO</p>
          <h2 className="final__title">Vamos começar o seu treino.</h2>
          <p className="final__text">Converse com o Danilo sobre seus objetivos, a modalidade que mais combina com você e os horários disponíveis.</p>
          <div className="final__steps" aria-label="Como começar">
            <span>01 / Conte seu objetivo</span>
            <span>02 / Escolha a modalidade</span>
            <span>03 / Combine os horários</span>
          </div>
          <div className="final__btns">
            <Btn href={CONTACT_HREF} className="btn--lg" external>Chamar no {CONTACT_LABEL}</Btn>
            <a className="phone" href={INSTAGRAM_HREF} target="_blank" rel="noopener noreferrer">@{INSTAGRAM}</a>
          </div>
        </div>
        <figure className="final__photo">
          <img src="img/hidro-grupo-800.webp" alt="Danilo com a turma de hidroginástica na piscina" width="800" height="740" loading="lazy" decoding="async" />
        </figure>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__in">
        <div>
          <a className="footer__brand-lockup" href="#inicio" aria-label="Danilo Almeida — voltar ao início">
            <Brand />
          </a>
          <p>Personal Trainer · Academia, piscina e movimento</p>
        </div>
        <div className="footer__r">
          <p>{CREF} · Proprietário da {COMPANY} ({COMPANY_CREF})</p>
          <a href={INSTAGRAM_HREF} target="_blank" rel="noopener noreferrer">Instagram @{INSTAGRAM}</a>
          <a href={COMPANY_IG_HREF} target="_blank" rel="noopener noreferrer">Instagram @{COMPANY_IG}</a>
        </div>
      </div>
    </footer>
  )
}

function ContactFloat() {
  const hide = useFloatHide()
  return (
    <a className={`wafloat ${hide ? 'wafloat--hide' : ''}`} tabIndex={hide ? -1 : undefined}
      href={CONTACT_HREF} target="_blank" rel="noopener noreferrer" aria-label={`Falar com o Danilo pelo ${CONTACT_LABEL}`}>
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 12a8.5 8.5 0 0 1-12.4 7.5L3 21l1.6-5.4A8.5 8.5 0 1 1 21 12z" />
      </svg>
    </a>
  )
}

export default function App() {
  useSiteEffects()
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Problem />
        <Method />
        <TrainingAreas />
        <About />
        <Gallery />
        <Modalities contactHref={CONTACT_HREF} />
        <Plans makeHref={planHref} />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <ContactFloat />
    </>
  )
}
