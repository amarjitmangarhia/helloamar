// Ray-traced Schwarzschild black hole (non-rotating, units rs = 1).
uniform vec2 uRes; uniform vec3 uCam, uF, uR, uU; uniform float uTime, uShift, uShiftY;
float hash(vec3 p){ p = fract(p*.3183099 + .1); p *= 17.; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float n2(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  float a=hash(vec3(i,1.)), b=hash(vec3(i+vec2(1,0),1.)), c=hash(vec3(i+vec2(0,1),1.)), d=hash(vec3(i+1.,1.));
  return mix(mix(a,b,f.x), mix(c,d,f.x), f.y); }
vec3 sky(vec3 d){
  vec3 c = vec3(0.);
  for(int k=0;k<2;k++){ float s = k==0 ? 90. : 220.; vec3 q = d*s, id = floor(q); float h = hash(id);
    if(h > .975){ float b = smoothstep(.35, 0., length(fract(q)-.5)); c += b*mix(vec3(1.,.8,.6), vec3(.7,.82,1.), hash(id+3.))*(h-.975)*40.; } }
  float band = pow(max(0., 1. - abs(d.y*.8 + d.z*.35)), 8.);
  c += vec3(.22,.18,.3)*band*(.5 + .5*n2(d.xz*6. + d.y*3.));
  return c;
}
void main(){
  vec2 uv = (gl_FragCoord.xy - .5*uRes)/uRes.y; uv.x += uShift; uv.y += uShiftY;
  vec3 dir = normalize(uR*uv.x + uU*uv.y + uF*1.5);
  vec3 pos = uCam, col = vec3(0.); float alpha = 1.;
  vec3 hv = cross(pos, dir); float h2 = dot(hv, hv);
  for(int i=0;i<260;i++){
    float r = length(pos);
    float dt = clamp(.07*r, .015, 1.5);
    vec3 prev = pos;
    dir += -1.5*h2*pos/pow(r, 5.)*dt;
    pos += dir*dt;
    if(prev.y*pos.y < 0.){
      vec3 p = mix(prev, pos, prev.y/(prev.y - pos.y)); float pr = length(p.xz);
      if(pr > 2.6 && pr < 15.){
        float ang = atan(p.z, p.x);
        float swirl = n2(vec2(pr*2.2, ang*3. + uTime*.9/pr*6.)) * .6 + n2(vec2(pr*7., ang*9. + uTime*1.5/pr*6.))*.4;
        float I = pow(2.6/pr, 1.6)*2.6*(.45 + .9*swirl);
        vec3 vel = normalize(vec3(-p.z, 0., p.x))*sqrt(.5/pr);
        float dop = 1. + 1.4*dot(vel, -normalize(dir));
        I *= pow(max(dop, .05), 3.);
        vec3 dc = mix(vec3(1.,.32,.08), vec3(1.,.86,.62), clamp(pow(2.6/pr,1.2)*dop*.9, 0., 1.));
        dc = mix(dc, vec3(.75,.85,1.), clamp((dop - 1.15)*1.2, 0., .5));
        float a = clamp(I*.9, 0., .96)*smoothstep(15., 9., pr)*smoothstep(2.6, 3.3, pr);
        col += alpha*dc*I*a; alpha *= 1. - a;
      }
    }
    if(r < 1.){ alpha = 0.; break; }
    if(r > 90. || alpha < .01) break;
  }
  col += alpha*sky(normalize(dir));
  col = 1. - exp(-col*1.3);
  gl_FragColor = vec4(pow(col, vec3(.9)), 1.);
}
