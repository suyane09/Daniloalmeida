import { useEffect, useRef } from 'react'

/**
 * Planos e valores informados pelo profissional (consultoria online).
 * `price` é o valor principal exibido; `items` lista variações quando existirem.
 */
const plans = [
  {
    number: '01',
    label: 'Individualizada · Mais completo',
    title: 'Consultoria Premium',
    description: 'Treino sob medida para academia ou casa, atualizado periodicamente (a cada 4 a 6 semanas).',
    info: 'Acompanhamento próximo, com suporte todos os dias.',
    price: 'R$ 290,00',
    suffix: '/ mês',
    includes: [
      'Suporte diário via WhatsApp para dúvidas e ajustes imediatos na planilha',
      'Avaliação de movimento por vídeo para correção de postura',
      'Reunião mensal em vídeo para revisar metas e avaliar sua evolução',
    ],
  },
  {
    number: '02',
    label: 'Planilha de treino · Autonomia',
    title: 'Consultoria Express',
    description: 'Treino personalizado e rotinas de mobilidade com base no seu formulário inicial. Ideal para quem já tem autonomia e busca foco.',
    info: 'Planilha direta ao ponto, com suporte limitado.',
    price: 'R$ 120,00',
    suffix: '',
    includes: [
      'Planilhas adaptadas ao seu objetivo',
      'Rotinas de mobilidade',
      'Suporte limitado via WhatsApp (uma vez por mês) para dúvidas gerais',
    ],
  },
  {
    number: '03',
    label: 'Avulso',
    title: 'Avaliação de Movimento e Postura',
    description: 'Análise detalhada de limitações e dores por videochamada, para identificar encurtamentos musculares.',
    info: 'Entenda o que limita seu movimento.',
    price: 'R$ 150,00',
    suffix: '',
    includes: [
      'Avaliação por videochamada',
      'Envio de vídeos das suas execuções (como agachamento e terra)',
      'Feedback corretivo de postura',
    ],
  },
  {
    number: '04',
    label: 'Em grupo · 21 dias',
    title: 'Desafio Mobilidade e Flexibilidade',
    description: 'Programa em grupo focado em melhorar a flexibilidade, aliviar dores nas costas e destravar as articulações.',
    info: 'Evolua junto com uma comunidade ativa.',
    price: 'R$ 50,00',
    suffix: '',
    includes: [
      'Rotinas diárias de 15 minutos de mobilidade e alongamento',
      'Para fazer em casa ou na academia',
      'Comunidade ativa para treinar junto',
    ],
  },
]

export default function Plans({ makeHref }) {
  const ref = useRef(null)

  useEffect(() => {
    const section = ref.current
    if (!section || typeof IntersectionObserver === 'undefined' ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const cards = [...section.querySelectorAll('.services__card')]
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        e.target.classList.add('is-visible')
        io.unobserve(e.target)
      }
    }, { threshold: 0.08, rootMargin: '0px 0px 60px 0px' })
    for (const c of cards) {
      if (c.getBoundingClientRect().top < window.innerHeight * 0.95) c.classList.add('is-visible')
      else io.observe(c)
    }
    section.classList.add('services--motion')
    return () => io.disconnect()
  }, [])

  return (
    <section ref={ref} className="sec services" id="planos" aria-labelledby="planos-title">
      <div className="wrap">
        <div className="services__intro">
          <div>
            <p className="services__eyebrow">CONSULTORIA ONLINE</p>
            <h2 className="h2" id="planos-title">Escolha como quer ser acompanhado.</h2>
          </div>
          <p>Do acompanhamento diário à planilha pronta, são quatro formas de treinar com orientação profissional, onde você estiver.</p>
        </div>
        <div className="services__grid">
          {plans.map((plan) => (
            <article className="services__card" key={plan.number} aria-labelledby={`plano-${plan.number}`}>
              <header className="services__card-top">
                <span className="services__number">{plan.number}</span>
                <span className="services__type">{plan.label}</span>
              </header>
              <div className="services__card-body">
                <div className="services__overview">
                  <h3 id={`plano-${plan.number}`}>{plan.title}</h3>
                  <p className="services__description">{plan.description}</p>
                  <p className="services__promise">{plan.info}</p>
                  <ul className="services__includes">
                    {plan.includes.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
                <div className="services__details">
                  <div className="services__cost">
                    <div className="services__price"><strong>{plan.price}</strong>{plan.suffix && <span>{plan.suffix}</span>}</div>
                  </div>
                  <a className="services__action" href={makeHref(plan.title)} target="_blank" rel="noopener noreferrer" aria-label={`Quero saber mais sobre ${plan.title}`}>
                    <span>Quero este plano</span><span className="services__action-arrow" aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="services__footer-note">Disponibilidade e forma de pagamento são confirmadas diretamente com o Danilo.</p>
      </div>
    </section>
  )
}
