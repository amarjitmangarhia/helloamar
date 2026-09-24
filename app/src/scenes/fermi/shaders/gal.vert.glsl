attribute vec3 aCol; attribute float aR;
uniform float uPR; uniform float uT; uniform float uOp;
varying vec3 vC; varying float vA;
void main(){
  vC = aCol;
  float sz = 1.2 + aR*1.6;
  vA = uOp*(.35 + .5*aR);
  gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.);
  gl_PointSize = sz*uPR;
}
