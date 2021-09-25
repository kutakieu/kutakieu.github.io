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
        
            void main() {
                vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
                vec2 color = (vec2(1.0) + p.xy) * 0.5;
                gl_FragColor = vec4(mouse.x, mouse.x, 1.0, 1.0);
            }
        `,
  };
  