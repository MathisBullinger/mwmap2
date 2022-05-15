#version 300 es

precision highp float;

uniform sampler2D uHeightMap;

in vec2 texCoord;

out vec4 outColor;

const ivec3 off = ivec3(-1, 0, 1);
const float scale = 100.0;

vec3 calcNormal(vec2 pos) {
  float center = texture(uHeightMap, pos).x * scale;
  float left = textureOffset(uHeightMap, pos, off.xy).x * scale;
  float right = textureOffset(uHeightMap, pos, off.zy).x * scale;
  float top = textureOffset(uHeightMap, pos, off.yx).x * scale;
  float bottom = textureOffset(uHeightMap, pos, off.yz).x * scale;

  vec3 dx = normalize(vec3(1, 0, right - left));
  vec3 dy = normalize(vec3(0, 1, bottom - top));

  return cross(dx, dy);
}


void main() {
  vec2 pos = vec2(texCoord.x, 1.0 - texCoord.y);
  outColor = vec4(calcNormal(pos), 1);
}
