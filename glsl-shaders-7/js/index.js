/** @format */

const vshader = `
  varying vec3 v_position;

  void main() {
    v_position = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fshader = `
  uniform vec2 u_resolution;

  varying vec3 v_position;

  void main() {
    vec3 color = vec3(0.0);
    color.r = smoothstep(0.0, 0.1, v_position.x);
    color.g = smoothstep(0.0, 0.1, v_position.y);


    gl_FragColor = vec4(color, 1.0);
  }
`

// var spector = new SPECTOR.Spector()
// spector.displayUI()
// spector.spyCanvases()
// spector.onCapture.add(capture => {
//   console.log('capture', capture)
//   // Do something with capture.
//   var myEvent = new CustomEvent('SpectorOnCaptureEvent', {
//     detail: { captureString: JSON.stringify(capture) },
//   })
//   document.dispatchEvent(myEvent)
// })

// var canvas = document.getElementsByTagName('canvas')
// spector.captureCanvas(canvas)

const scene = new THREE.Scene()
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const clock = new THREE.Clock()
const geometry = new THREE.PlaneGeometry(2, 2)

const uniforms = {
  u_color: {
    value: new THREE.Color(0xff0000),
  },
  u_time: {
    value: 0.0,
  },
  u_mouse: {
    value: {
      x: 0.0,
      y: 0.0,
    },
  },
  u_resolution: {
    value: {
      x: 0.0,
      y: 0.0,
    },
  },
}

const material = new THREE.ShaderMaterial({
  uniforms,
  vertexShader: vshader,
  fragmentShader: fshader,
})

const plane = new THREE.Mesh(geometry, material)
scene.add(plane)

camera.position.z = 1

onWindowResize()

function move(event) {
  uniforms.u_mouse.value.x = event.touches ? event.touches[0].clientX : event.clientX
  uniforms.u_mouse.value.y = event.touches ? event.touches[0].clientY : event.clientY
}

if ('ontouchstart' in window) {
  document.addEventListener('touchmove', move)
} else {
  window.addEventListener('resize', onWindowResize, false)
  document.addEventListener('mousemove', move)
}

animate()

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  uniforms.u_time.value = clock.getElapsedTime()
}

function onWindowResize(event) {
  const aspectRatio = window.innerWidth / window.innerHeight
  let width, height
  if (aspectRatio >= 1) {
    width = 1
    height = (window.innerHeight / window.innerWidth) * width
  } else {
    width = aspectRatio
    height = 1
  }
  camera.left = -width
  camera.right = width
  camera.top = height
  camera.bottom = -height
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)

  if (uniforms.u_resolution !== undefined) {
    uniforms.u_resolution.value.x = window.innerWidth
    uniforms.u_resolution.value.y = window.innerHeight
  }
}
