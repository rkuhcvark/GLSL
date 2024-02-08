/** @format */

const vshader = `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fshader = `
  void main() {
    gl_FragColor = vec4(0.1, 0.3, 1.0, 1.0);
  }
`

const scene = new THREE.Scene()
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const geometry = new THREE.PlaneGeometry(2, 2)
const material = new THREE.ShaderMaterial({
  vertexShader: vshader,
  fragmentShader: fshader,
})

const plane = new THREE.Mesh(geometry, material)
scene.add(plane)

camera.position.z = 1

onWindowResize()

window.addEventListener('resize', onWindowResize, false)

animate()

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
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
}
