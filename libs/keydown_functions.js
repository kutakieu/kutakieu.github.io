
export function onUp_key(event, camera, direction, camera_speed){
    if(event.shiftKey){
        camera.position.addScaledVector(camera.up, camera_speed)
    }else{
        // to move the camera forward
        camera.getWorldDirection(direction);
        var direction_tmp_2d = new THREE.Vector2(direction.x, direction.z).normalize();
        camera.position.addScaledVector(new THREE.Vector3(direction_tmp_2d.x, 0, direction_tmp_2d.y), camera_speed);
    }
}

export function onDown_key(event, camera, direction, camera_speed){
    if(event.shiftKey){
        camera.position.addScaledVector(new THREE.Vector3(0,-1,0), camera_speed)
    }else{
        // to move the camera backward
        camera.getWorldDirection(direction);
        var direction_tmp_2d = new THREE.Vector2(direction.x, direction.z).normalize();
        camera.position.addScaledVector(new THREE.Vector3(direction_tmp_2d.x, 0, direction_tmp_2d.y).multiplyScalar(-1.0), camera_speed);
    }
}

export function onRight_key(event, camera, direction, camera_speed){
    camera.getWorldDirection(direction);
    var direction_tmp = direction.cross(camera.up.normalize())
    var direction_tmp_2d = new THREE.Vector2(direction_tmp.x, direction_tmp.z).normalize();
    camera.position.addScaledVector(new THREE.Vector3(direction_tmp_2d.x, 0, direction_tmp_2d.y), camera_speed);
}

export function onLeft_key(event, camera, direction, camera_speed){
    camera.getWorldDirection(direction);
    var direction_tmp = direction.cross(camera.up.normalize()).multiplyScalar(-1.0)
    var direction_tmp_2d = new THREE.Vector2(direction_tmp.x, direction_tmp.z).normalize();
    camera.position.addScaledVector(new THREE.Vector3(direction_tmp_2d.x, 0, direction_tmp_2d.y), camera_speed);
}
