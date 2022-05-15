#version 300 es

precision highp float;

uniform sampler2D uHeightMap;
uniform vec3 lightPos;

in vec2 texCoord;

out vec4 outColor;

void main() {
  float height = texture(uHeightMap, vec2(texCoord.x, 1.0 - texCoord.y)).x;
  outColor = vec4(height, 0.5 + height / 2.0, 0, 1);

  if (texture(uHeightMap, vec2(texCoord.x, 1.0 - texCoord.y)).x <= 0.1) {
    outColor = vec4(0, 0, 0, 1);
  }
}
