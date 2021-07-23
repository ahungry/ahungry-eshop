// document.querySelector('.info').addEventListener('click', )

function main () {
  const els = document.querySelectorAll('.info')

  for (let i = 0; i < els.length; i++) {
    const el = els[i]

    el.addEventListener('click', e => {
      const href = el.parentElement.querySelector('a').href

      window.open(href)
    })
  }
}

window.onload = main
