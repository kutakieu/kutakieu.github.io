import { shader as shader1 } from './shader1.js';
import { shader as shader2 } from './shader2.js';
import { shader as shader3 } from './shader3.js';
import { shader as shader4 } from './shader4.js';
import { shader as shader5 } from './shader5.js';

const shaders = [
    shader1,
    shader2,
    shader3,
    shader4,
    shader5
]

export function shader_accessor(index){
    return shaders[index-1];
}
