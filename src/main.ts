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

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
gl.clearColor(0, 0, 0, 1)
gl.clear(gl.COLOR_BUFFER_BIT)

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
  gl.drawArrays(gl.TRIANGLES, 0, 6)
}
