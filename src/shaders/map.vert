#version 300 es

layout (location = 0) in vec2 vPos;
layout (location = 1) in vec2 vTex;

out vec2 texCoord;

uniform mat4 view;
uniform mat4 projection;

void main() {
  gl_Position = projection * view * vec4(vPos, 0, 1);
  texCoord = vTex;
}
