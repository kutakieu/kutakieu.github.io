import { setup_canvas } from '../webgl_setup.js';
// import { shader_accessor } from './shaders/accessor.js';
import { shader as shader0 } from './shader0.js';
import { shader as shader1 } from './shader1.js';
import { shader as shader2 } from './shader2.js';

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString);
const project_id = urlParams.get('id') ? urlParams.get('id') : "5"


function main(){
  const canvas = document.getElementById('container');
  // let shader = shader_accessor(project_id);
  setup_canvas(canvas, window.innerWidth, window.innerHeight, shader0, shader1, shader2);
}

main();
