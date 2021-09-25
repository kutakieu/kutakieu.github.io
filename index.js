import { shader_accessor } from './shaders/accessor.js';
import { setup_canvas } from './src/webgl_setup.js';

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString);
const project_id = urlParams.get('id') ? urlParams.get('id') : "5"


function main(){
  const canvas = document.getElementById('container');
  let shader = shader_accessor(project_id);
  setup_canvas(canvas, window.innerWidth, window.innerHeight, shader.vert, shader.frag);
}

main();
