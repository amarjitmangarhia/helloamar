varying float vA;
void main(){
  float d = length(gl_PointCoord*2.-1.); if(d>1.) discard;
  gl_FragColor = vec4(vec3(1.), vA*(1.-d));
}
