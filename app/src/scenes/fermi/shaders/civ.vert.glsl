attribute vec3 aCol; attribute float aR;
uniform float uPR; uniform float uT;
uniform float uShow; uniform float uKeep; uniform float uDim; uniform float uUs;
varying vec3 vC; varying float vA;
void main(){
  vC = aCol;
  float me = step(aR, .0001);   // index 0 = "Us"
  float on = (1.-me) * smoothstep(uShow, uShow - .05, aR) * smoothstep(1. - uKeep - .05, 1. - uKeep, 1. - aR);
  float tw = .75 + .25*sin(uT*3. + aR*80.);
  vA = max(on*tw*(1. - uDim*.8), me*uUs*(.7 + .3*sin(uT*4.)));
  float sz = mix(6., 11., me) * (me > .5 ? 1. + .3*sin(uT*4.) : 1.);
  gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.);
  gl_PointSize = sz*uPR;
}
