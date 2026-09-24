attribute float aRand; attribute vec3 aCol;
uniform float uPR;
varying vec3 vCol; varying float vRim;
void main(){
  vec3 n = normalize(position);
  vec3 wn = normalize((modelMatrix*vec4(n,0.)).xyz);
  float diff = max(dot(wn, normalize(vec3(-.5,.9,.5))), 0.);
  vCol = aCol*(.45+.7*diff);
  vRim = pow(1.-abs(wn.z), 3.);
  vec4 mv = modelViewMatrix*vec4(position,1.);
  gl_Position = projectionMatrix*mv;
  gl_PointSize = mix(2., 4., aRand)*uPR;
}
