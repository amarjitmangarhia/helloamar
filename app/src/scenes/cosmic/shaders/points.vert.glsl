attribute vec3 aCol; attribute float aSize;
uniform float uSize; uniform float uPR;
varying vec3 vC;
void main(){
  vC = aCol;
  gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.);
  gl_PointSize = uSize*aSize*uPR;
}
