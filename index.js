import { shader } from './shaders/shader4.js';
import { setup_canvas } from './src/webgl_setup.js';

function main(){
  const canvas = document.getElementById('container');
  // setup_canvas(canvas, 300, 300, shader.vert, shader.frag);
  setup_canvas(canvas, window.innerWidth, window.innerHeight, shader.vert, shader.frag);
}

main();
