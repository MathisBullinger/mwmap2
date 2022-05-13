import vertexShaderSource from './shaders/map.vert'
import fragmentShaderSource from './shaders/map.frag'

const canvas = document.querySelector<HTMLCanvasElement>('canvas')!
canvas.width = window.innerWidth * devicePixelRatio
canvas.height = window.innerHeight * devicePixelRatio
const gl = canvas.getContext('webgl2')

const vertexShader = createShader(vertexShaderSource, gl.VERTEX_SHADER)
const fragmentShader = createShader(fragmentShaderSource, gl.FRAGMENT_SHADER)
const program = createProgram(vertexShader, fragmentShader)

const posLocation = gl.getAttribLocation(program, 'a_position')
const texLocation = gl.getAttribLocation(program, 'a_texcoord')

const posBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array([-1, 1, -1, -1, 1, -1, -1, 1, 1, -1, 1, 1]),
  gl.STATIC_DRAW
)
const vao = gl.createVertexArray()
gl.bindVertexArray(vao)
gl.enableVertexAttribArray(posLocation)
gl.vertexAttribPointer(posLocation, 2, gl.FLOAT, false, 0, 0)

const texcoordBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer)
setTexcoords()
gl.enableVertexAttribArray(texLocation)
gl.vertexAttribPointer(texLocation, 2, gl.FLOAT, true, 0, 0)

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
gl.clearColor(0, 0, 0, 0)
gl.clear(gl.COLOR_BUFFER_BIT)
gl.useProgram(program)
gl.bindVertexArray(vao)

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

function createShader(source: string, type: number) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw gl.getShaderInfoLog(shader)
  }
  return shader
}

function createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw gl.getProgramInfoLog(program)
  }
  return program
}

function setTexcoords() {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0]),
    gl.STATIC_DRAW
  )
}
