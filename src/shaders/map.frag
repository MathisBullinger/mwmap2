#version 300 es

precision highp float;

uniform sampler2D uHeightMap;
uniform vec3 lightPos;

in vec2 texCoord;
in vec3 fragPos;

const vec3 lightColor = vec3(1, 1, 1);
const vec3 ambient = vec3(0.2, 0.2, 0.2);

out vec4 outColor;

const ivec3 off = ivec3(-1, 0, 1);
const float scale = 20.0;

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
  vec2 texPos = vec2(texCoord.x, 1.0 - texCoord.y);
  if (texture(uHeightMap, texPos).x <= 0.1) {
    outColor = vec4(0.1, 0.1, 0.1, 1);
  } else {
    vec3 normal = calcNormal(texPos);
    vec3 lightDir = normalize(lightPos - fragPos);
    float diff = max(dot(normal, lightDir), 0.0) * 0.8;
    vec3 diffuse = diff * lightColor;
    vec3 color = ambient + diffuse;
    
    outColor = vec4(color, 1);
  }
}
