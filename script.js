// Interações básicas: navegação suave, quiz e localStorage de progresso
const storageKey = 'eduSiteProgress_v1'

document.addEventListener('DOMContentLoaded', ()=>{
  // Smooth scrolling for nav links
  document.querySelectorAll('.site-nav a, .skip-link').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const href = a.getAttribute('href')
      if(href && href.startsWith('#')){
        e.preventDefault()
        const target = document.querySelector(href)
        if(target) target.scrollIntoView({behavior:'smooth',block:'start'})
      }
    })
  })

  const form = document.getElementById('quizForm')
  const progressEl = document.getElementById('progress')
  const clearBtn = document.getElementById('clearProgress')

  function loadProgress(){
    try{
      const raw = localStorage.getItem(storageKey)
      if(!raw) return null
      return JSON.parse(raw)
    }catch(e){
      console.error('Erro lendo progresso', e)
      return null
    }
  }

  function saveProgress(data){
    try{
      localStorage.setItem(storageKey, JSON.stringify(data))
    }catch(e){
      console.error('Erro salvando progresso', e)
    }
  }

  function updateProgressUI(){
    const data = loadProgress()
    if(!data){
      progressEl.textContent = 'Progresso: nenhum'
      return
    }
    progressEl.textContent = `Progresso: respostas salvas em ${new Date(data.savedAt).toLocaleString()}`
  }

  // Preenche o formulário com dados salvos
  (function hydrateForm(){
    const data = loadProgress()
    if(!data || !data.answers) return
    Object.entries(data.answers).forEach(([k,v])=>{
      const field = form.elements[k]
      if(field) field.value = v
    })
  })()

  form.addEventListener('submit', (e)=>{
    e.preventDefault()
    const answers = {
      q1: form.elements['q1'].value,
      q2: form.elements['q2'].value,
      q3: form.elements['q3'].value,
    }
    const score = computeScore(answers)
    const payload = {answers,score,savedAt:Date.now()}
    saveProgress(payload)
    updateProgressUI()
    // feedback acessível
    alert(`Respostas salvas. Pontuação: ${score}/3`)
  })

  clearBtn.addEventListener('click', ()=>{
    localStorage.removeItem(storageKey)
    form.reset()
    updateProgressUI()
  })

  function computeScore(answers){
    let s = 0
    if(answers.q1 === 'html') s++
    if(answers.q2 === 'acess') s++
    if(answers.q3 === 'localStorage') s++
    return s
  }

  updateProgressUI()
})
