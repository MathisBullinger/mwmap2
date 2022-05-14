import debounce from 'facula/debounce'
import Vector from './math/vector'
import { afterResize, canvas, translate, zoom } from './render'

window.addEventListener('resize', debounce(afterResize, 32))

canvas.addEventListener(
  'wheel',
  (e) => {
    if (!e.deltaX && !e.deltaY) return

    if (e.ctrlKey) {
      e.preventDefault()
      zoom(-e.deltaY / 500)
    } else {
      translate(new Vector<2>(-e.deltaX / 500, e.deltaY / 500))
    }
  },
  { passive: false }
)
