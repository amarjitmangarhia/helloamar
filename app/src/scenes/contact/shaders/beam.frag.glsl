varying float vA;
void main(){
  if(vA<=0.) discard;
  float d = length(gl_PointCoord*2.-1.); if(d>1.) discard;
  gl_FragColor = vec4(mix(vec3(1.,.9,.6), vec3(1.), .5), vA*(1.-d));
}
