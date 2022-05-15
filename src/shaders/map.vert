#version 300 es

layout (location = 0) in vec2 vPos;
layout (location = 1) in vec2 vTex;

out vec2 texCoord;
out vec3 fragPos;

uniform mat4 model;
uniform mat4 projection;

uniform sampler2D uHeightMap;

void main() {
  vec2 texPos = vec2(vPos.x, 1.0 - vPos.y);
  float height = texture(uHeightMap, texPos).x;
  gl_Position = projection * model * vec4(vPos, -1.0 + height * 0.06, 1);
  fragPos = vec3(model * vec4(vPos, 0, 1));
  texCoord = vTex;
}
