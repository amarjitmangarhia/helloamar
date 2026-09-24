varying vec3 vCol; varying float vRim;
void main(){
  float d = length(gl_PointCoord*2.-1.); if(d>1.) discard;
  vec3 col = vCol + vec3(.6,.8,1.)*vRim*.5;
  gl_FragColor = vec4(col, (1.-d));
}
