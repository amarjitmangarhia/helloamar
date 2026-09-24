attribute vec3 aCol; attribute float aRand;
uniform float uSize; uniform float uPR; uniform float uTime; uniform float uOff;
varying vec3 vC; varying float vA;
void main(){
  vec3 p = position;
  #ifdef SNOW
  p.y = mod(p.y + uOff + uTime*0.05*(0.5+aRand), 14.) - 7.;
  p.x += sin(uTime*.3 + aRand*20.)*.15;
  #endif
  #ifdef JELLY
  float pulse = sin(uTime*1.6 + aRand*.3);
  if (aRand < .5) { p.xz *= 1. + .12*pulse; } else { p.x += sin(uTime*1.2 + p.y*2.)*.08*(-p.y); }
  #endif
  vC = aCol; vA = 1.;
  #ifdef SPARK
  vA = pow(max(0., sin(uTime*(.6+aRand*1.4) + aRand*40.)), 12.);
  #endif
  vec4 mv = modelViewMatrix*vec4(p,1.);
  gl_Position = projectionMatrix*mv;
  gl_PointSize = uSize*(.6+aRand*.8)*uPR*(6./-mv.z);
}
