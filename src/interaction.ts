import debounce from 'facula/debounce'
import Vector from './math/vector'
import { afterResize, canvas, model, translate, zoom } from './render'

window.addEventListener('resize', debounce(afterResize, 32))

canvas.addEventListener(
  'wheel',
  (e) => {
    if (!e.deltaX && !e.deltaY) return
    const z = Math.max(1 - model.getTranslation().z, 0.1)

    if (e.ctrlKey) {
      e.preventDefault()
      zoom((-e.deltaY / 500) * z)
    } else {
      translate(new Vector<2>((-e.deltaX / 1000) * z, (e.deltaY / 1000) * z))
    }
  },
  { passive: false }
)
