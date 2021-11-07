export const shader = {
    vert: `
    attribute vec3 position;

    void main(void){
      gl_Position = vec4(position, 1.0);
    }
        `,
  
    frag: `
    precision mediump float;
    uniform float time;
    uniform vec2  resolution;
    
    const float PI = ${Math.PI};
    const int Iterations = 10;
    const float Scale = 2.0;
    const float angle = 60.0;
    const float fov = angle * 0.5 * PI / 180.0;
    vec3  cPos = vec3(0.0, 0.0, -3.0);
    const vec3 lightDir = vec3(-0.577, 0.577, 0.577);


    float distanceFunc(vec3 z)
    {
      vec3 a1 = vec3(1.,1.,1.);
      vec3 a2 = vec3(-1.,-1.,1.);
      vec3 a3 = vec3(1.,-1.,-1.);
      vec3 a4 = vec3(-1.,1.,-1.);
      vec3 c;
      int n = 0;
      float dist, d;
      for (int n=0; n < Iterations; n++) {
        c = a1;
        dist = length(z-a1);
        d = length(z-a2); if (d < dist) { c = a2; dist=d; }
        d = length(z-a3); if (d < dist) { c = a3; dist=d; }
        d = length(z-a4); if (d < dist) { c = a4; dist=d; }
        z = Scale*z-c*(Scale-1.0);
      }

      return length(z) * pow(Scale, float(-Iterations));
    }
        
    vec3 getNormal(vec3 p){
      float d = 0.0001;
      return normalize(vec3(
        distanceFunc(p + vec3(  d, 0.0, 0.0)) - distanceFunc(p + vec3( -d, 0.0, 0.0)),
        distanceFunc(p + vec3(0.0,   d, 0.0)) - distanceFunc(p + vec3(0.0,  -d, 0.0)),
        distanceFunc(p + vec3(0.0, 0.0,   d)) - distanceFunc(p + vec3(0.0, 0.0,  -d))
      ));
    }
    
    void main(void){
      // fragment position
      vec2 p = gl_FragCoord.xy - resolution.xy / 2.0;
      float focal_len = abs(resolution.x / 2.0) / tan(fov / 2.0);
      vec3 ray = normalize(vec3(p.x, p.y, focal_len));	
      
      // marching loop
      float distance = 0.0;
      float rLen = 0.0;
      vec3  rPos = cPos;
      for(int i = 0; i < 256; i++){
        distance = distanceFunc(rPos);
        rLen += distance;
        rPos = cPos + ray * rLen;
        if (distance < 0.01)break;
        if (distance > 10.0)break;
      }
      
      vec3 col = mix(vec3(0.02), vec3(0.2, 0.16, 0.1), pow(dot(ray, vec3(0.0, 0.0, 1.0)), 30.0));

      if(distance < 10.0){
        vec3 normal = getNormal(rPos);
        float diff = clamp(dot(lightDir, normal), 0.0, 1.0);
        col = vec3(diff, 0. ,0.);
        gl_FragColor = vec4(col, 1.0);
      }else{
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
      }
    }
        `,
  };
  

  