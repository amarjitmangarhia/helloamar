attribute float aRand; uniform float uTime; uniform float uPR; uniform float uSize; varying vec3 vCol;
void main(){
  vec3 p = position; p.z += sin(uTime*1.3 + aRand*6.28 + p.x)*0.04;
  vec4 mv = modelViewMatrix*vec4(p,1.);
  gl_Position = projectionMatrix*mv;
  gl_PointSize = uSize*mix(.6,1.3,fract(aRand*13.7))*uPR/(-mv.z);
  vCol = mix(vec3(.424,.765,.812), vec3(.945,.604,.51), smoothstep(-3.,3.,p.x + sin(aRand*6.28)*.5));
}
