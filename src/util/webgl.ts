import * as assert from './assert'
import Matrix from '../math/matrix'

export class Shader {
  constructor(
    private readonly gl: WebGL2RenderingContext,
    type: number,
    source: string
  ) {
    this.shader = assert.notNull(gl.createShader(type))
    gl.shaderSource(this.shader, source)
    gl.compileShader(this.shader)
    if (!gl.getShaderParameter(this.shader, gl.COMPILE_STATUS)) {
      throw gl.getShaderInfoLog(this.shader)
    }
  }

  public readonly shader: WebGLShader
}

export class Program {
  constructor(
    gl: WebGL2RenderingContext,
    vertexShader: string,
    fragmentShader: string
  )
  constructor(
    gl: WebGL2RenderingContext,
    vertexShader: Shader,
    fragmentShader: Shader
  )
  constructor(
    private readonly gl: WebGL2RenderingContext,
    vertexShader: Shader | string,
    fragmentShader: Shader | string
  ) {
    this.program = assert.notNull(gl.createProgram())
    gl.attachShader(
      this.program,
      (typeof vertexShader === 'string'
        ? new Shader(gl, gl.VERTEX_SHADER, vertexShader)
        : vertexShader
      ).shader
    )
    gl.attachShader(
      this.program,
      (typeof fragmentShader === 'string'
        ? new Shader(gl, gl.FRAGMENT_SHADER, fragmentShader)
        : fragmentShader
      ).shader
    )
    gl.linkProgram(this.program)
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS))
      throw gl.getProgramInfoLog(this.program)
  }

  public getLocation(attribute: string): number {
    if (!this.attributeLocations.has(attribute))
      this.attributeLocations.set(
        attribute,
        this.gl.getAttribLocation(this.program, attribute)
      )
    return this.attributeLocations.get(attribute)!
  }

  public getUniform(name: string): WebGLUniformLocation | null {
    if (!this.uniformLocations.has(name))
      this.uniformLocations.set(
        name,
        this.gl.getUniformLocation(this.program, name)
      )
    return this.uniformLocations.get(name)!
  }

  public passMatrix(name: string, matrix: Matrix) {
    this.gl.uniformMatrix4fv(this.getUniform(name), false, matrix.values)
  }

  public use() {
    this.gl.useProgram(this.program)
  }

  private readonly attributeLocations = new Map<string, number>()
  private readonly uniformLocations = new Map<
    string,
    WebGLUniformLocation | null
  >()
  private readonly program: WebGLProgram
}

export class VertexBuffer {
  constructor(private readonly gl: WebGL2RenderingContext, data: number[]) {
    this.buffer = assert.notNull(gl.createBuffer())
    this.bind()
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)
  }

  public bind() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer)
  }

  public unbind() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer)
  }

  private readonly buffer: WebGLBuffer
}

export class VertexArray {
  constructor(private readonly gl: WebGL2RenderingContext) {
    this.vao = assert.notNull(gl.createVertexArray())
  }

  public bind() {
    this.gl.bindVertexArray(this.vao)
  }

  public unbind() {
    this.gl.bindVertexArray(null)
  }

  public addBuffer(buffer: VertexBuffer, layout: BufferLayout) {
    this.bind()
    buffer.bind()
    let offset = 0

    for (let i = 0; i < layout.size(); i++) {
      this.gl.enableVertexAttribArray(i)
      const el = layout.get(i)
      this.gl.vertexAttribPointer(
        i,
        el.count,
        el.type,
        el.normalized ?? false,
        layout.getStride(),
        offset
      )
      offset += el.count * BufferLayout.getSize(this.gl, el.type)
    }
  }

  private readonly vao: WebGLVertexArrayObject
}

export class BufferLayout {
  constructor(private readonly gl: WebGL2RenderingContext) {}

  public push(element: BufferLayoutElement): BufferLayout {
    this.elements.push(element)
    this.stride += element.count * BufferLayout.getSize(this.gl, element.type)
    return this
  }

  public size(): number {
    return this.elements.length
  }

  public get(i: number): BufferLayoutElement {
    assert.assert(i >= 0 && i < this.elements.length)
    return this.elements[i]
  }

  public getStride(): number {
    return this.stride
  }

  public static getSize(gl: WebGL2RenderingContext, type: GLenum): number {
    switch (type) {
      case gl.BYTE:
        return 1
      case gl.SHORT:
        return 2
      case gl.INT:
        return 4
      case gl.UNSIGNED_INT:
        return 4
      case gl.FLOAT:
        return 4
      default:
        throw Error(`unknown type ${type}`)
    }
  }

  private stride = 0
  private elements: BufferLayoutElement[] = []
}

type BufferLayoutElement = { type: GLenum; count: number; normalized?: boolean }
