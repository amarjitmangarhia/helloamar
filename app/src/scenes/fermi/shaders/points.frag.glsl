varying vec3 vC; varying float vA;
void main(){
  float d = length(gl_PointCoord*2.-1.); if(d>1.) discard;
  gl_FragColor = vec4(vC, pow(1.-d,1.6)*vA);
}
