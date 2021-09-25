//standard ray-marching example

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
    uniform vec2  mouse;
    uniform vec2  resolution;
    
    const float PI = 3.14159265;
    const vec3 lightDir = vec3(-0.577, 0.577, 0.577);

    const float sphereSize = 1.0;
    const vec3 boxSize1 = vec3(.25, 3.0, .25);
    const vec3 boxSize2 = vec3(3.0, .25, .25);
    const vec3 boxSize3 = vec3(.25, .25, 3.0);
    
    vec3 trans(vec3 p){
      return mod(p, 6.0) - 2.0;
    }

    vec3 rotate(vec3 p, float angle, vec3 axis){
      vec3 a = normalize(axis);
      float s = sin(angle);
      float c = cos(angle);
      float r = 1.0 - c;
      mat3 m = mat3(
          a.x * a.x * r + c,
          a.y * a.x * r + a.z * s,
          a.z * a.x * r - a.y * s,
          a.x * a.y * r - a.z * s,
          a.y * a.y * r + c,
          a.z * a.y * r + a.x * s,
          a.x * a.z * r + a.y * s,
          a.y * a.z * r - a.x * s,
          a.z * a.z * r + c
      );
      return m * p;
    }

    float distanceFunc_sphere(vec3 p, float size, vec3 position){
      return length(p + position) - size;
    }

    float distanceFunc_box(vec3 p, vec3 size){
      vec3 q = abs(trans(p));
      return length(max(q - size, 0.0));
    }

    float distanceFunc(vec3 p){

      // if(mod((time / 10.0), 3.0) < 1.0){
      //   p = rotate(p, radians(time * 20.0), vec3(0.0, 0.0, 1.0));
      // }else if (mod((time / 10.0), 3.0) < 2.0){
      //   p = rotate(p, radians(time * 20.0), vec3(0.0, 1.0, 0.0));
      // }else{
      //   p = rotate(p, radians(time * 20.0), vec3(1.0, 0.0, 0.0));
      // }
      p = rotate(p, radians(time * 20.0), vec3(0.0, 0.0, 1.0));

      // p.x += clamp(p.z/10.0, 0.0, 1.0);
      // p.y += clamp(p.z/10.0, 0.0, 1.0);

      float distance_box1 = distanceFunc_box(p, boxSize1);
      float distance_box2 = distanceFunc_box(p, boxSize2);
      float distance_box3 = distanceFunc_box(p, boxSize3);
      float distance_sphere = distanceFunc_sphere(p, 1.0, vec3(1.0, 1.0, 0.0));

      return min(distance_sphere, min(distance_box1, min(distance_box2, distance_box3)));
    }
    
    vec3 getNormal(vec3 p){
      float d = 0.0001;
      return normalize(vec3(
          distanceFunc(p + vec3(  d, 0.0, 0.0)) - distanceFunc(p + vec3( -d, 0.0, 0.0)),
          distanceFunc(p + vec3(0.0,   d, 0.0)) - distanceFunc(p + vec3(0.0,  -d, 0.0)),
          distanceFunc(p + vec3(0.0, 0.0,   d)) - distanceFunc(p + vec3(0.0, 0.0,  -d))
      ));
  }

    vec3 getNormal_box(vec3 p, vec3 size){
      float d = 0.0001;
      return normalize(vec3(
        distanceFunc_box(p + vec3(  d, 0.0, 0.0), size) - distanceFunc_box(p + vec3( -d, 0.0, 0.0), size),
        distanceFunc_box(p + vec3(0.0,   d, 0.0), size) - distanceFunc_box(p + vec3(0.0,  -d, 0.0), size),
        distanceFunc_box(p + vec3(0.0, 0.0,   d), size) - distanceFunc_box(p + vec3(0.0, 0.0,  -d), size)
      ));
    }

    
    
    void main(void){
      vec3  cPos = vec3(0, 0, time*10.0);
      // float angle = 60.0 + sin(time) * 30.0;
      float angle = 60.0;
      float fov = angle * 0.5 * PI / 180.0;

      // fragment position
      vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
      
      // ray
      vec3 ray = normalize(vec3(sin(fov) * p.x, sin(fov) * p.y, -cos(fov)));	
      
      // marching loop
      float distance = 0.0;
      // float distance_sphere = 0.0;
      // float distance_box1 = 0.0;
      // float distance_box2 = 0.0;
      // float distance_box3 = 0.0;
      float rLen = 0.0;
      vec3  rPos = cPos;
      for(int i = 0; i < 64; i++){
        distance = distanceFunc(rPos);
        rLen += distance;
        rPos = cPos + ray * rLen;
      }

      
      // hit check
      if(abs(distance) < 0.001){
        vec3 normal = getNormal(rPos);
        float diff = clamp(dot(lightDir, normal), 0.1, 1.0);
        gl_FragColor = vec4(normal.x, length(cPos-rPos)*0.025, 1.0-diff, 1.0-diff);
      }else{
        gl_FragColor = vec4(vec3(0.0), 1.0);
      }
    }
        `,
  };
  

  