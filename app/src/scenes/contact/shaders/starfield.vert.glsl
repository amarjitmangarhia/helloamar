attribute float aRand;
uniform float uPR; uniform float uTime; uniform float uWarp;
varying float vA;
void main(){
  gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.);
  float tw = pow(max(0., sin(uTime*(.5+aRand*1.5)+aRand*60.)), 3.);
  vA = (.3 + .7*tw) * (1. + uWarp*1.1);
  gl_PointSize = mix(1., 3., aRand)*uPR*(1.+uWarp*.7);
}
