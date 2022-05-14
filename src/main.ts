import { Program, VertexBuffer, BufferLayout, VertexArray } from './util/webgl'
import * as assert from './util/assert'

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

const posBuffer = new VertexBuffer(gl, [0, 0, 0, 0.5, 0.7, 0])
const vao = new VertexArray(gl)
vao.addBuffer(
  posBuffer,
  new BufferLayout(gl).push({ count: 2, type: gl.FLOAT })
)

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
gl.clearColor(0, 0, 0, 1)
gl.clear(gl.COLOR_BUFFER_BIT)

program.use()
vao.bind()
gl.drawArrays(gl.TRIANGLES, 0, 3)
