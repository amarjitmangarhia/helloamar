varying vec3 vCol;
void main(){
  vec2 c = gl_PointCoord*2.-1.; float r2 = dot(c,c);
  if(r2>1.) discard;
  vec3 n = vec3(c.x,-c.y,sqrt(1.-r2));
  vec3 L = normalize(vec3(-.5,.7,.6));
  float diff = max(dot(n,L),0.);
  float spec = pow(max(dot(reflect(-L,n),vec3(0,0,1)),0.),28.);
  vec3 col = vCol*(.62+.5*diff) + spec*.3;
  gl_FragColor = vec4(col,1.);
}
