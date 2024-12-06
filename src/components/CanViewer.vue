<template>
  <div ref="container" class="w-full h-full bg-gradient"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const container = ref(null)
let scene, camera, renderer, controls, canBody, canTop, canBottom, animationFrameId

// Can dimensions
const HEIGHT = 5
const RADIUS = 1.5

const init = () => {
  // Scene setup
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x1a1a1a)
  
  // Camera setup
  camera = new THREE.PerspectiveCamera(
    75,
    container.value.clientWidth / container.value.clientHeight,
    0.1,
    1000
  )
  camera.position.z = 10
  camera.position.y = 2

  // Renderer setup
  renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true 
  })
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.0
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  container.value.appendChild(renderer.domElement)

  // Controls setup
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.minDistance = 5
  controls.maxDistance = 15
  controls.maxPolarAngle = Math.PI / 1.5
  controls.minPolarAngle = Math.PI / 4

  // Lighting setup
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.5)
  keyLight.position.set(5, 5, 5)
  keyLight.castShadow = true
  keyLight.shadow.mapSize.width = 2048
  keyLight.shadow.mapSize.height = 2048
  keyLight.shadow.camera.near = 0.5
  keyLight.shadow.camera.far = 500
  scene.add(keyLight)

  const fillLight = new THREE.DirectionalLight(0x8293cf, 0.7)
  fillLight.position.set(-5, 0, -5)
  scene.add(fillLight)

  const backLight = new THREE.DirectionalLight(0xffffff, 0.8)
  backLight.position.set(0, 5, -5)
  scene.add(backLight)

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
  scene.add(ambientLight)

  // Ground plane
  const groundGeometry = new THREE.PlaneGeometry(100, 100)
  const groundMaterial = new THREE.ShadowMaterial({
    opacity: 0.3
  })
  const ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.rotation.x = -Math.PI / 2
  ground.position.y = -HEIGHT/2 - 0.1
  ground.receiveShadow = true
  scene.add(ground)

  // Create can parts with different materials
  // Body material (will receive texture)
  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xff0000,
    metalness: 0.7,
    roughness: 0.3,
    clearcoat: 0.8,
    clearcoatRoughness: 0.2
  })

  // Cap material (metallic grey)
  const capMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x444444,
    metalness: 0.9,
    roughness: 0.2,
    clearcoat: 0.5,
    clearcoatRoughness: 0.3
  })

  // Create body cylinder
  const bodyGeometry = new THREE.CylinderGeometry(RADIUS, RADIUS, HEIGHT, 32, 1, true)
  canBody = new THREE.Mesh(bodyGeometry, bodyMaterial)
  canBody.castShadow = true
  canBody.receiveShadow = true

  // Create top cap
  const topGeometry = new THREE.CircleGeometry(RADIUS, 32)
  canTop = new THREE.Mesh(topGeometry, capMaterial)
  canTop.rotation.x = -Math.PI / 2
  canTop.position.y = HEIGHT / 2
  canTop.castShadow = true
  canTop.receiveShadow = true

  // Create bottom cap
  const bottomGeometry = new THREE.CircleGeometry(RADIUS, 32)
  canBottom = new THREE.Mesh(bottomGeometry, capMaterial)
  canBottom.rotation.x = Math.PI / 2
  canBottom.position.y = -HEIGHT / 2
  canBottom.castShadow = true
  canBottom.receiveShadow = true

  // Create a group to hold all can parts
  const canGroup = new THREE.Group()
  canGroup.add(canBody)
  canGroup.add(canTop)
  canGroup.add(canBottom)
  scene.add(canGroup)

  // Animation loop
  const animate = () => {
    animationFrameId = requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
  }
  animate()

  // Handle window resize
  const handleResize = () => {
    camera.aspect = container.value.clientWidth / container.value.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  }
  window.addEventListener('resize', handleResize)
}

// Exposed methods for parent component
const updateColor = (color) => {
  if (canBody) {
    canBody.material.color.set(color)
  }
}

const updateTexture = (imageUrl) => {
  if (canBody) {
    const textureLoader = new THREE.TextureLoader()
    textureLoader.load(imageUrl, (texture) => {
      texture.encoding = THREE.sRGBEncoding
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      canBody.material.map = texture
      canBody.material.needsUpdate = true
    })
  }
}

let rotationSpeed = 0
const updateRotationSpeed = (speed) => {
  rotationSpeed = speed * 0.01
}

// Animation function for continuous rotation
const animate = () => {
  if (canBody && canTop && canBottom) {
    canBody.rotation.y += rotationSpeed
    canTop.rotation.y += rotationSpeed
    canBottom.rotation.y += rotationSpeed
  }
  requestAnimationFrame(animate)
}

// Lifecycle hooks
onMounted(() => {
  init()
  animate()
})

onBeforeUnmount(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  if (renderer) {
    renderer.dispose()
  }
  if (controls) {
    controls.dispose()
  }
  window.removeEventListener('resize', handleResize)
})

// Expose methods to parent
defineExpose({
  updateColor,
  updateTexture,
  updateRotationSpeed
})
</script>

<style scoped>
.bg-gradient {
  background: radial-gradient(circle at center, #2563eb 0%, #1e40af 100%);
}
</style>