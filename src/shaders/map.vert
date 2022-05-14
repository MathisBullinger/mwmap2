#version 300 es

layout (location = 0) in vec2 vPos;
layout (location = 1) in vec2 vTex;

out vec2 texCoord;

uniform mat4 view;
uniform mat4 projection;

uniform sampler2D uHeightMap;

void main() {
  gl_Position = projection * view * vec4(vPos, -1.0 + texture(uHeightMap, vec2(vPos.x, 1.0 - vPos.y)).x * 0.3, 1);
  texCoord = vTex;
}
