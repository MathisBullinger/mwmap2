#version 300 es

precision highp float;

uniform sampler2D uHeightMap;

in vec2 texCoord;

out vec4 outColor;

void main() {
  vec2 pos = vec2(texCoord.x, 1.0 - texCoord.y);
  outColor = vec4(calcNormal(pos), 1);
}
