attribute float aRand; uniform float uPR; uniform float uSize; varying vec3 vCol;
void main(){
  vec4 mv = modelViewMatrix*vec4(position,1.);
  gl_Position = projectionMatrix*mv;
  gl_PointSize = uSize*mix(.8,1.15,aRand)*uPR/(-mv.z);
  vCol = mix(vec3(.424,.765,.812), vec3(.62,.8,.6), smoothstep(-.6,1.,position.y + aRand*.3));
}
