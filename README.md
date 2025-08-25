Guia Web — HTML, CSS e JavaScript (Sem frameworks)

Sobre
---
Pequeno site educativo que explica HTML, CSS e JavaScript, boas práticas, panorama de tecnologias e um fluxograma de projeto. Não há back-end; quando necessário os dados são salvos no navegador com localStorage.

Como abrir o projeto
---
1. Abra o arquivo `index.html` no seu navegador (duplo clique ou arraste para a janela do navegador).
2. Ou sirva localmente com um servidor estático (recomendado para testes de fetch/serviços). Em PowerShell você pode usar:

```powershell
# Servir com Python 3 (opcional). No PowerShell, execute na pasta do projeto:
python -m http.server 8080

# Depois abra http://localhost:8080
```

Conteúdo
---
- `index.html` — página principal (HTML5 sem frameworks)
- `styles.css` — estilos responsivos e acessíveis (CSS3)
- `script.js` — interações em JavaScript ES6+ e persistência via localStorage

Fluxograma
---
O fluxograma do fluxo de trabalho está embutido na página usando SVG (veja a seção "Fluxograma").

Créditos e autoria
---
- Conteúdo e layout: material educativo criado para o exercício do curso.
- Autor(es) do repositório: substitua <seunome> pelo seu nome ao criar o repositório público no GitHub.

Publicar no GitHub (repositório público solicitado)
---
Recomenda-se criar um repositório público com o nome `guia-web-1ano-<seunome>` (por exemplo `guia-web-1ano-laryssa`).

Passos rápidos (PowerShell) para criar o repositório localmente e enviar ao GitHub:

```powershell
# 1) Inicialize (se ainda não inicializou)
git init
git branch -M main

# 2) Crie o repositório no GitHub (use a interface web) com o nome desejado

# 3) Conecte o remoto (substitua a URL pelo repositório que você criou)
git remote add origin https://github.com/<seunome>/guia-web-1ano-<seunome>.git

# 4) Push com commits claros
git add .
git commit -m "chore: initial commit — site educativo sobre HTML/CSS/JS"
git push -u origin main
```

Notas sobre commits claros
---
- Use mensagens curtas e descritivas (tipo: feat:, fix:, docs:, style:, chore:).
- Faça commits pequenos e atômicos (uma responsabilidade por commit).

Hospedagem sugerida
---
- GitHub Pages: nas configurações do repositório, ative Pages a partir da branch `main` (caminho `/`).
- Outras opções: Netlify, Vercel (sites estáticos). Essas plataformas aceitam este projeto sem back-end.

Licença
---
Adicione um arquivo `LICENSE` se desejar disponibilizar o conteúdo com uma licença específica (MIT, CC-BY, etc.).

Contato
---
Abra uma issue no repositório ou inclua seu e-mail/handle para feedback.

Obrigado por usar este guia!
