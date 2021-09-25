export const shader = {
    vert: `
            // an attribute will receive data from a buffer
            attribute vec2 position;
        
            // all shaders have a main function
            void main() {
        
            // gl_Position is a special variable a vertex shader
            // is responsible for setting
            gl_Position = vec4(position, 0, 1);
            }
        `,
  
    frag: `
            // fragment shaders don't have a default precision so we need
            // to pick one. mediump is a good default
            precision mediump float;
            uniform float time;
            uniform vec2  mouse;
            uniform vec2  resolution;
        
            // void main() {
            //     vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
            //     vec2 color = (vec2(1.0) + p.xy) * 0.5;
            //     gl_FragColor = vec4(color, (mouse.x+mouse.y)/2.0, 1.0);
            // }

            void main() {
                vec2 uv = (gl_FragCoord.xy / resolution.xx - 0.5) * 8.0;
                vec2 uv0 = uv;
                float i0 = 1.0;
                float i1 = 1.0;
                float i2 = 1.0;
                float i4 = 0.0;
                for (int s = 0; s < 7; s++) {
                  vec2 r;
                  r = vec2(cos(uv.y * i0 - i4 + time / i1), sin(uv.x * i0 - i4 + time / i1)) / i2;
                  r += vec2(-r.y, r.x) * 0.3;
                  uv.xy += r;
              
                  i0 *= 1.93;
                  i1 *= 1.15;
                  i2 *= 1.7;
                  i4 += 0.05 + 0.1 * time * i1;
                }
                float r = sin(uv.x - time) * 0.5 + 0.5;
                float b = sin(uv.y + time) * 0.5 + 0.5;
                float g = sin((uv.x + uv.y + sin(time * 0.5)) * 0.5) * 0.5 + 0.5;
                gl_FragColor = vec4(r, g, b, 1.0);
              }
        `,
  };
  

  