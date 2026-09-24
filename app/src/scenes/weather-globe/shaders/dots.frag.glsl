varying vec3 vCol;
void main(){
  vec2 c = gl_PointCoord*2.-1.; float r2 = dot(c,c); if(r2>1.) discard;
  vec3 n = vec3(c.x,-c.y,sqrt(1.-r2)); float d = max(dot(n,normalize(vec3(-.5,.7,.6))),0.);
  gl_FragColor = vec4(vCol*(.65+.45*d),1.);
}
