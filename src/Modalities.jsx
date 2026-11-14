import { useEffect, useRef } from 'react'

/**
 * Modalidades de atuação informadas pelo profissional.
 * Sem valores publicados: condições e horários são combinados no contato.
 */
const groups = [
  {
    number: '01',
    label: 'Academia',
    title: 'Treino em sala',
    description: 'Orientação individual para quem quer ganhar força, melhorar o condicionamento e treinar com técnica e segurança.',
    items: ['Musculação', 'Ginástica localizada', 'Treinamento funcional', 'Alongamento'],
  },
  {
    number: '02',
    label: 'Piscina',
    title: 'Treino na água',
    description: 'Aulas em piscina para treinar com menos impacto, aprender a nadar ou aprimorar a técnica, das crianças aos adultos.',
    items: ['Hidroginástica', 'Natação infantil', 'Natação adulto'],
  },
  {
    number: '03',
    label: 'Esporte e recreação',
    title: 'Movimento e diversão',
    description: 'Atividades para crianças e para quem gosta de jogar, com orientação e foco em aprender se divertindo.',
    items: ['Recreação infantil', 'Futebol', 'Futsal'],
  },
]

export default function Modalities({ contactHref }) {
  const ref = useRef(null)

  useEffect(() => {
    const section = ref.current
    if (!section || typeof IntersectionObserver === 'undefined' ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const cards = [...section.querySelectorAll('.modal__card')]
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
    section.classList.add('modal--motion')
    return () => io.disconnect()
  }, [])

  return (
    <section ref={ref} className="sec modal" id="modalidades" aria-labelledby="modal-title">
      <div className="wrap">
        <div className="modal__intro">
          <div>
            <p className="modal__eyebrow">MODALIDADES</p>
            <h2 className="h2" id="modal-title">Onde você quiser treinar, tem acompanhamento.</h2>
          </div>
          <p>Da sala de musculação à piscina, passando pelo funcional e pela recreação infantil. Escolha a modalidade e converse com o Danilo para combinar o melhor formato.</p>
        </div>
        <div className="modal__grid">
          {groups.map((g) => (
            <article className="modal__card" key={g.number} aria-labelledby={`modal-${g.number}`}>
              <header className="modal__top">
                <span className="modal__number">{g.number}</span>
                <span className="modal__type">{g.label}</span>
              </header>
              <h3 id={`modal-${g.number}`}>{g.title}</h3>
              <p className="modal__desc">{g.description}</p>
              <ul className="modal__list">
                {g.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <a className="modal__action" href={contactHref} target="_blank" rel="noopener noreferrer" aria-label={`Falar com o Danilo sobre ${g.title}`}>
                <span>Quero saber mais</span><span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>
        <p className="modal__note">Valores, horários e disponibilidade são combinados diretamente com o Danilo.</p>
      </div>
    </section>
  )
}
