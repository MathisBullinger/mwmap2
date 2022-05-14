import debounce from 'facula/debounce'
import Vector from './math/vector'
import { afterResize, canvas, translate } from './render'

window.addEventListener('resize', debounce(afterResize, 32))

canvas.addEventListener(
  'wheel',
  (e) => {
    if (!e.deltaX && !e.deltaY) return
    const translation = new Vector<2>(-e.deltaX / 500, e.deltaY / 500)
    translate(translation)
  },
  { passive: true }
)
