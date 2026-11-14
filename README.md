# Danilo Almeida · Personal Trainer

Landing page (React 18 + Vite 5), mesma estrutura do site do Rogério Déo.

    npm install && npm run dev      # desenvolvimento
    npm run build                   # gera dist/ (Vercel/Netlify: saída dist)

## Onde editar (src/App.jsx)
- `PHONE`: DDI+DDD+número (ex.: '5521999999999'). Vazio = botões abrem o direct do Instagram.
- Textos: listas `problems`, `method`, `trainingAreas`, `faq`; modalidades em `src/Modalities.jsx`.
- Cores/fontes: variáveis `:root` em `src/styles.css`.
- Imagens: `public/img/`. Antes de publicar, defina o domínio nas metas og: do `index.html`.
