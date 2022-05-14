#version 300 es

precision highp float;

uniform sampler2D uHeightMap;

in vec2 texCoord;

out vec4 outColor;

void main() {
  outColor = texture(uHeightMap, vec2(texCoord.x, 1.0 - texCoord.y));
  if (texture(uHeightMap, vec2(texCoord.x, 1.0 - texCoord.y)).x <= 0.1) {
    outColor = vec4(0, 0, 0, 1);
  }
}
