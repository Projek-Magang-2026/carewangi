document.addEventListener('DOMContentLoaded',()=>{
  const nav=document.getElementById('nav'),burger=document.getElementById('burger'),menu=document.getElementById('menu');
  const onScroll=()=>nav.classList.toggle('scrolled',window.scrollY>10);
  onScroll();window.addEventListener('scroll',onScroll,{passive:true});
  const setMenu=o=>{menu.classList.toggle('open',o);burger.setAttribute('aria-expanded',o);burger.setAttribute('aria-label',o?'Tutup menu':'Buka menu')};
  burger.addEventListener('click',()=>setMenu(!menu.classList.contains('open')));
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});
  document.querySelectorAll('.item button').forEach(b=>b.addEventListener('click',()=>{
    const item=b.parentElement,open=!item.classList.contains('open');
    document.querySelectorAll('.item.open').forEach(i=>{i.classList.remove('open');i.querySelector('button').setAttribute('aria-expanded','false')});
    item.classList.toggle('open',open);b.setAttribute('aria-expanded',open);
  }));
});
