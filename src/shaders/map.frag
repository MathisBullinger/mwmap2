#version 300 es

precision highp float;

uniform sampler2D uHeightMap;

in vec2 texCoord;

out vec4 outColor;

void main() {
  outColor = texture(uHeightMap, texCoord);
  if (outColor.x <= 0.1) {
    outColor = vec4(0, 0, 0, 1);
  }
}
