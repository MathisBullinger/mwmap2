import { Program, VertexBuffer, BufferLayout, VertexArray } from './util/webgl'
import * as assert from './util/assert'
import Matrix from './math/matrix'
import Vector from './math/vector'
import { perspective } from './math/projection'
import { gridMesh } from './util/mesh'

import vertexShaderSource from './shaders/map.vert'
import fragmentShaderSource from './shaders/map.frag'

export const canvas = document.querySelector<HTMLCanvasElement>('canvas')!
const gl = assert.notNull(
  canvas.getContext('webgl2', { desynchronized: true }),
  'failed to create webgl2 context'
)

const program = new Program(gl, vertexShaderSource, fragmentShaderSource)

const gridCoords = gridMesh(100, 100)
console.log(`${gridCoords.length / 4} vertices`)

const vao = new VertexArray(gl)
vao.addBuffer(
  new VertexBuffer(gl, gridCoords),
  new BufferLayout(gl)
    .push({ count: 2, type: gl.FLOAT })
    .push({ count: 2, type: gl.FLOAT })
)

export function translate(translation: Vector) {
  model = Matrix.translate(Vector.from(3, translation)).multiply(model)
  render()
}

export function zoom(n: number) {
  model = Matrix.translate(new Vector<3>(0, 0, n)).multiply(model)
  render()
}

gl.clearColor(0.2, 0.2, 0.2, 1)
gl.enable(gl.DEPTH_TEST)

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
  afterResize()
}

export function afterResize() {
  canvas.width = window.innerWidth * devicePixelRatio
  canvas.height = window.innerHeight * devicePixelRatio
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
  projection = getProjection()
  render()
}

const getProjection = () =>
  perspective(90, gl.canvas.width / gl.canvas.height, 0.01, 10)

export let model = Matrix.translate(new Vector<3>(-0.5, -0.5, 0))
  .multiply(Matrix.scale(new Vector<3>(2, 2, 1)))
  .multiply(new Matrix(4, 4))

let projection = getProjection()

let lastRenderRequest = 0
let renderId = 0

const lightPos = new Vector<3>(0, 0, 0)
gl.uniform3fv(
  program.getUniform('lightPos')!,
  new Float32Array(lightPos.values)
)

function render_() {
  program.passMatrix('model', model)
  program.passMatrix('projection', projection)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLES, 0, gridCoords.length / 4)

  if (performance.now() - lastRenderRequest < 50)
    renderId = requestAnimationFrame(render_)
  else renderId = 0
}

export function render() {
  lastRenderRequest = performance.now()
  if (renderId) return
  renderId = 1
  render_()
}
