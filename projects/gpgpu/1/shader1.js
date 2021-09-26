export const shader = {
    vert: 
    `
    attribute vec3 position;
    void main(){
        gl_Position = vec4(position, 1.0);
    }
    `,

    frag:
    `
    precision mediump float;
    uniform vec2 resolution;
    uniform sampler2D texture;
    uniform vec2 mouse;
    uniform bool mouseFlag;
    uniform float velocity;
    const float SPEED = 0.05;
    void main(){
        vec2 p = gl_FragCoord.xy / resolution;
        vec4 t = texture2D(texture, p);
        vec2 v = normalize(mouse - t.xy) * 0.2;
        vec2 w = normalize(v + t.zw);
        vec4 destColor = vec4(t.xy + w * SPEED * velocity, w);
        if(!mouseFlag){destColor.zw = t.zw;}
        gl_FragColor = destColor;
    }
    `
}
