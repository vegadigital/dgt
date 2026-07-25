# Digitalis Infoproducts — Site institucional

Página institucional da **Digitalis Infoproducts LLC**, construída com **Next.js** (App Router) e **Tailwind CSS**.

## Requisitos

- Node.js 18.18+ (recomendado 20+)

## Rodar localmente

```bash
npm install
npm run dev
```

Acesse http://localhost:3000

## Build de produção

```bash
npm run build
npm start
```

## Deploy na Vercel

1. Suba este repositório no GitHub/GitLab/Bitbucket.
2. Em [vercel.com](https://vercel.com), clique em **Add New → Project** e importe o repositório.
3. A Vercel detecta o Next.js automaticamente — basta clicar em **Deploy** (nenhuma configuração extra necessária).

Alternativa via CLI:

```bash
npm i -g vercel
vercel
```

## Estrutura

```
app/
  layout.jsx     # layout raiz + fonte Poppins + metadata
  page.jsx       # página institucional (client component)
  globals.css    # Tailwind + direção de arte (aurora/glass)
tailwind.config.js
postcss.config.mjs
next.config.mjs
```

## Personalização rápida

- **E-mail de contato:** procure por `contato@digitalisinfoproducts.com` em `app/page.jsx`.
- **Textos das seções:** editáveis nos arrays no topo de `app/page.jsx` (`PILLARS`, `SOLUTIONS`, `VALORES`, etc.).
