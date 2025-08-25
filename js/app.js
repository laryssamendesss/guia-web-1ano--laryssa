// app.js - funcionalidades comuns: tema, menu, atalhos, e módulos para cada página
const Theme = (function(){
  const key = 'gw_theme_v1'
  function apply(theme){
    try{ if(theme === 'dark') document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark'); }
    catch(e){console.error(e)}
  }
  function load(){ return localStorage.getItem(key) || 'light' }
  function save(t){ localStorage.setItem(key,t) }
  function toggle(){ const t = load() === 'dark' ? 'light' : 'dark'; save(t); apply(t); }
  return {load,save,apply,toggle}
})()

// Mobile nav
function initNav(){
  const btn = document.getElementById('navToggle')
  const nav = document.getElementById('navList')
  if(!btn || !nav) return
  btn.addEventListener('click', ()=>{
    const expanded = btn.getAttribute('aria-expanded') === 'true'
    btn.setAttribute('aria-expanded', String(!expanded))
    nav.classList.toggle('open')
  })
}

// Keyboard shortcuts
function initShortcuts(){
  document.addEventListener('keydown', (e)=>{
    if(e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA'){
      const s = document.getElementById('searchTech')
      if(s){ e.preventDefault(); s.focus(); }
    }
    if(e.altKey && (e.key === 'm' || e.key === 'M')){
      const btn = document.getElementById('navToggle'); if(btn) btn.click()
    }
    if(e.key === 'Home'){
      window.scrollTo({top:0,behavior:'smooth'})
    }
  })
}

// Page specific: Tecnologias
const TechsModule = (function(){
  const storageKey = 'gw_last_tech_filter'
  function init(){
    const container = document.getElementById('techsContainer')
    if(!container) return
    const search = document.getElementById('searchTech')
    const filters = Array.from(document.querySelectorAll('[data-filter]'))
    const exportBtn = document.getElementById('exportCSV')
    const last = localStorage.getItem(storageKey)
    if(last){
      const btn = document.querySelector(`[data-filter-value="${last}"]`)
      if(btn) btn.click()
    }

    function applyFilter(value){
      const cards = Array.from(container.querySelectorAll('.tech-card'))
      cards.forEach(card => {
        const cat = card.dataset.category || ''
        const matches = value === 'all' || cat === value || card.dataset.name.toLowerCase().includes(value)
        card.style.display = matches ? '' : 'none'
      })
    }

    filters.forEach(f => {
      f.addEventListener('click', ()=>{
        const val = f.dataset.filterValue
        // aria
        const expanded = f.getAttribute('aria-expanded') === 'true'
        f.setAttribute('aria-expanded', String(!expanded))
        // reset others
        filters.forEach(o=>{ if(o!==f) o.setAttribute('aria-expanded','false') })
        applyFilter(val)
        localStorage.setItem(storageKey,val)
      })
    })

    search.addEventListener('input', ()=>{
      const q = search.value.trim().toLowerCase()
      const cards = Array.from(container.querySelectorAll('.tech-card'))
      cards.forEach(card => {
        const text = (card.innerText||'').toLowerCase()
        card.style.display = text.includes(q) ? '' : 'none'
      })
    })

    // Modal
    const modalBackdrop = document.getElementById('techModal')
    const modal = document.querySelector('#techModal .modal')
    const modalTitle = document.getElementById('techModalTitle')
    const modalBody = document.getElementById('techModalBody')
    let lastFocused = null

    function openModalForCard(card){
      if(!card) return
      lastFocused = document.activeElement
      const name = card.dataset.name
      const when = card.dataset.when || ''
      const pros = card.dataset.pros || ''
      const cons = card.dataset.cons || ''
      modalTitle.textContent = name
      modalBody.innerHTML = `<p>${when}</p><h4>Prós</h4><ul>${pros.split('|').map(p=>`<li>${p}</li>`).join('')}</ul><h4>Contras</h4><ul>${cons.split('|').map(p=>`<li>${p}</li>`).join('')}</ul><h4>Quando escolher?</h4><ul><li>Analise requisitos</li><li>Considere equipe</li><li>Prove com PoC</li></ul>`
      modalBackdrop.classList.add('open')
      modal.classList.add('open')
      modalBackdrop.setAttribute('aria-hidden','false')
      // move focus into modal
      const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      if(focusable) focusable.focus()
    }

    function closeModal(){
      modalBackdrop.classList.remove('open')
      modal.classList.remove('open')
      modalBackdrop.setAttribute('aria-hidden','true')
      if(lastFocused) lastFocused.focus()
    }

    container.addEventListener('click', (e)=>{
      const card = e.target.closest('.tech-card')
      if(!card) return
      // if clicking the favorite toggle, don't open modal
      if(e.target.closest('.fav-toggle')) return
      openModalForCard(card)
    })
    // keyboard: Enter on focused card opens modal
    container.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter'){
        const card = document.activeElement.closest && document.activeElement.closest('.tech-card')
        if(card) openModalForCard(card)
      }
    })

    // close modal (button)
    const closeBtn = document.getElementById('techModalClose')
    if(closeBtn) closeBtn.addEventListener('click', ()=>{ closeModal() })
    // close on ESC
    document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeModal() })
    // click outside to close
    modalBackdrop.addEventListener('click', (e)=>{ if(e.target === modalBackdrop) closeModal() })

    // Favorites (persisted) and Export CSV
    const favKey = 'gw_favs_v1'
    const favs = new Set(JSON.parse(localStorage.getItem(favKey) || '[]'))

    function updateFavUI(id, btn){
      const isFav = favs.has(id)
      if(btn) btn.setAttribute('aria-pressed', String(isFav))
      if(btn) btn.classList.toggle('is-fav', isFav)
    }

    // attach handlers to fav buttons (delegation)
    container.addEventListener('click', (e)=>{
      const fav = e.target.closest('.fav-toggle')
      if(!fav) return
      const id = fav.dataset.techName
      if(!id) return
      if(favs.has(id)) favs.delete(id); else favs.add(id)
      localStorage.setItem(favKey, JSON.stringify(Array.from(favs)))
      updateFavUI(id, fav)
      e.stopPropagation()
    })

    // initialize fav UI for existing fav buttons
    Array.from(container.querySelectorAll('.fav-toggle')).forEach(b=> updateFavUI(b.dataset.techName,b))

    exportBtn.addEventListener('click', ()=>{
      try{
        const cards = Array.from(container.querySelectorAll('.tech-card')).filter(c=>c.style.display !== 'none')
        const rows = [['Nome','Categoria','Prós','Contras','Favorito']]
        cards.forEach(c=>rows.push([c.dataset.name,c.dataset.category,c.dataset.pros,c.dataset.cons, favs.has(c.dataset.name) ? 'SIM' : '']))
        const csv = rows.map(r=>r.map(v=>`"${(v||'').replace(/"/g,'""')}"`).join(',')).join('\n')
        const blob = new Blob([csv],{type:'text/csv'})
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a'); a.href = url; a.download = 'tecnologias.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url)
      }catch(e){console.error(e); alert('Erro ao exportar CSV')}
    })
  }
  return {init}
})()

// Accordion + checklist (Boas Práticas)
const AccordionModule = (function(){
  const key = 'gw_bp_checklist'
  function init(){
    const items = document.querySelectorAll('.accordion-header')
    items.forEach(h => {
      h.addEventListener('click', ()=>{
        const panel = h.nextElementSibling
        const open = panel.classList.toggle('open')
        h.setAttribute('aria-expanded', String(open))
      })
    })
    // checklist
    const checks = document.querySelectorAll('.bp-check')
    if(!checks) return
    const saved = JSON.parse(localStorage.getItem(key) || '{}')
    checks.forEach(c=>{ c.checked = !!saved[c.id]; c.addEventListener('change', ()=>{ saved[c.id] = c.checked; localStorage.setItem(key, JSON.stringify(saved)); updateProgress(); }) })
    function updateProgress(){ const total = checks.length; const done = Array.from(checks).filter(c=>c.checked).length; const percent = Math.round((done/total)*100); const el = document.getElementById('bpProgress'); if(el) el.textContent = `Progresso: ${percent}%` }
    updateProgress()
  }
  return {init}
})()

// Fluxo tooltips
const FluxoModule = (function(){
  function init(){
    const steps = document.querySelectorAll('.flow-step')
    const tooltip = document.getElementById('flowTooltip')
    if(!steps.length || !tooltip) return
    steps.forEach(s=>{
      s.addEventListener('click', ()=>{
        tooltip.innerHTML = `<strong>${s.dataset.title}</strong><p>${s.dataset.deliverables}</p><p><em>Riscos:</em> ${s.dataset.risks}</p>`
        tooltip.classList.add('open')
      })
    })
    document.addEventListener('click', (e)=>{ if(!e.target.closest('.flow-step') && !e.target.closest('#flowTooltip')) tooltip.classList.remove('open') })
  }
  return {init}
})()

// Quiz module
const QuizModule = (function(){
  const bestKey = 'gw_quiz_best'
  function init(){
    const form = document.getElementById('quizFormPage')
    if(!form) return
    form.addEventListener('submit', (e)=>{
      e.preventDefault()
      const answers = Array.from(form.querySelectorAll('[data-answer]'))
      let score = 0
      answers.forEach(a=>{ const sel = form.elements[a.name]; if(sel && sel.value === a.dataset.answer) score++ })
      const best = parseInt(localStorage.getItem(bestKey)||'0',10)
      if(score > best) localStorage.setItem(bestKey,String(score))
      const result = document.getElementById('quizResult')
      result.innerHTML = `<p>Pontuação: ${score}/${answers.length}</p><p>Melhor: ${Math.max(score,best)}</p>`
    })
  }
  return {init}
})()

// Init on DOM ready
document.addEventListener('DOMContentLoaded', ()=>{
  try{ Theme.apply(Theme.load()) }catch(e){}
  // Theme toggle
  const themeToggle = document.getElementById('themeToggle')
  if(themeToggle) themeToggle.addEventListener('click', ()=>{ Theme.toggle(); })
  initNav(); initShortcuts(); TechsModule.init(); AccordionModule.init(); FluxoModule.init(); QuizModule.init();
})
