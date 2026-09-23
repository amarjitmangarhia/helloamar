attribute vec3 aS0; attribute vec3 aS1; attribute vec3 aS2; attribute vec3 aS3; attribute vec3 aS4;
attribute float aRand;
uniform float uW[5]; uniform float uTime; uniform float uIntro;
uniform vec2 uMouse; uniform float uMouseStr; uniform float uSize; uniform float uPR;
uniform vec3 uColA; uniform vec3 uColB;
varying vec3 vCol;
void main(){
  vec3 p = aS0*uW[0] + aS1*uW[1] + aS2*uW[2] + aS3*uW[3] + aS4*uW[4];
  float t = uTime*0.6;
  vec3 wob = vec3(sin(t+p.y*3.+aRand*6.28), cos(t*.8+p.x*3.), sin(t*.9+p.z*3.+aRand*3.));
  p += 0.035*wob;
  vec3 scat = normalize(p+0.001)*(3.5+aRand*3.) + wob*0.5;
  float e = 1. - pow(1.-clamp(uIntro*1.4-aRand*0.4,0.,1.), 3.);
  p = mix(scat, p, e);
  vec4 wp = modelMatrix*vec4(p,1.);
  vec2 d = wp.xy-uMouse; float dl = length(d)+1e-4;
  float f = exp(-dl*dl*2.5)*uMouseStr;
  wp.xy += d/dl*f*0.55; wp.z += f*0.5;
  vec4 mv = viewMatrix*wp;
  gl_Position = projectionMatrix*mv;
  gl_PointSize = uSize*mix(.6,1.35,fract(aRand*13.7))*uPR/(-mv.z);
  vCol = mix(uColA, uColB, smoothstep(-1.4,1.4, wp.y + sin(aRand*6.2831)*.6));
}
