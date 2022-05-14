import { Program, VertexBuffer, BufferLayout, VertexArray } from './util/webgl'
import * as assert from './util/assert'
import Matrix from './math/matrix'
import { orthogonal } from './math/projection'
import debounce from 'facula/debounce'

import vertexShaderSource from './shaders/map.vert'
import fragmentShaderSource from './shaders/map.frag'

const canvas = document.querySelector<HTMLCanvasElement>('canvas')!
canvas.width = window.innerWidth * devicePixelRatio
canvas.height = window.innerHeight * devicePixelRatio
const gl = assert.notNull(
  canvas.getContext('webgl2'),
  'failed to create webgl2 context'
)

const program = new Program(gl, vertexShaderSource, fragmentShaderSource)

const vao = new VertexArray(gl)
vao.addBuffer(
  new VertexBuffer(
    gl,
    // prettier-ignore
    [
      -1,  1,  0, 0,
      -1, -1,  0, 1,
       1, -1,  1, 1,
       1, -1,  1, 1,
       1,  1,  1, 0,
      -1,  1,  0, 0
    ]
  ),
  new BufferLayout(gl)
    .push({ count: 2, type: gl.FLOAT })
    .push({ count: 2, type: gl.FLOAT })
)

const view = new Matrix(4, 4)
let projection = getProjection()

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
gl.clearColor(0, 0, 0, 1)

program.use()
vao.bind()

const texture = gl.createTexture()
gl.bindTexture(gl.TEXTURE_2D, texture)
gl.texImage2D(
  gl.TEXTURE_2D,
  0,
  gl.RGBA,
  1,
  1,
  0,
  gl.RGBA,
  gl.UNSIGNED_BYTE,
  new Uint8Array([0, 0, 255, 255])
)

const image = new Image()
image.src = '/heightmap.bmp'
image.onload = () => {
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
  gl.generateMipmap(gl.TEXTURE_2D)

  render()
}

window.addEventListener(
  'resize',
  debounce(() => {
    console.log('resize')
    canvas.width = window.innerWidth * devicePixelRatio
    canvas.height = window.innerHeight * devicePixelRatio
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    projection = getProjection()
    render()
  }, 32)
)

function getProjection() {
  return orthogonal({
    center: [0, 0],
    width: Math.max(gl.canvas.width / gl.canvas.height, 1) * 2,
    height: Math.max(gl.canvas.height / gl.canvas.width, 1) * 2,
    near: 0,
    far: 1,
  })
}

function render() {
  program.passMatrix('view', view)
  console.log('render', projection)
  program.passMatrix('projection', projection)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLES, 0, 6)
}
