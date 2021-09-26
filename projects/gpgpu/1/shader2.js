export const shader = {
    vert: 
    `
    attribute float index;
    attribute vec3 position;
    uniform vec2 resolution;
    uniform sampler2D texture;
    uniform float pointScale;
    void main(){
        vec2 p = vec2(
            mod(index, resolution.x) / resolution.x,
            floor(index / resolution.x) / resolution.y
        );
        vec4 t = texture2D(texture, p);
        gl_Position  = vec4(t.xy, 0.0, 1.0);
        gl_PointSize = 0.1 + pointScale;
    }
    `,

    frag:
    `
    precision mediump float;
    // uniform vec4 ambient;
    void main(){
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
    `
}
