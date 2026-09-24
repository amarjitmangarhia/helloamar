attribute float aI; // 0..1 position along the trail
uniform float uPR; uniform float uHead; uniform vec3 uOrigin; uniform vec3 uDir; uniform float uLen;
varying float vA;
void main(){
  float visible = step(aI, uHead);
  float tail = 1. - smoothstep(0., 1., (uHead - aI) / max(uHead, .05));
  vA = visible*tail;
  vec3 p = uOrigin + uDir*aI*uLen;
  vec4 mv = modelViewMatrix*vec4(p,1.);
  gl_Position = projectionMatrix*mv;
  gl_PointSize = mix(4., 1., aI)*uPR*visible;
}
