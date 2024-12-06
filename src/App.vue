<template>
  <div class="flex min-h-screen">
    <!-- 3D Viewer -->
    <div class="flex-1 relative">
      <CanViewer ref="canViewer" />
    </div>

    <!-- Controls Panel -->
    <div class="w-80 bg-white bg-opacity-90 p-6 shadow-lg">
      <h1 class="text-2xl font-bold mb-6 text-gray-800">CanStyle</h1>
      
      <!-- Color Controls -->
      <div class="mb-6">
        <h2 class="text-lg font-semibold mb-3 text-gray-700">
          <font-awesome-icon icon="palette" class="mr-2" />
          Base Color
        </h2>
        <input type="color" class="w-full h-10 cursor-pointer" v-model="baseColor" @input="updateBaseColor" />
      </div>

      <!-- Texture Controls -->
      <div class="mb-6">
        <h2 class="text-lg font-semibold mb-3 text-gray-700">
          <font-awesome-icon icon="image" class="mr-2" />
          Custom Texture
        </h2>
        <input 
          type="file" 
          accept="image/*" 
          class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          @change="updateTexture"
        />
      </div>

      <!-- Rotation Controls -->
      <div class="mb-6">
        <h2 class="text-lg font-semibold mb-3 text-gray-700">
          <font-awesome-icon icon="rotate" class="mr-2" />
          Rotation Speed
        </h2>
        <input 
          type="range" 
          min="0" 
          max="5" 
          step="0.1" 
          class="w-full"
          v-model="rotationSpeed"
          @input="updateRotationSpeed"
        />
      </div>

      <!-- Action Buttons -->
      <div class="grid grid-cols-2 gap-4">
        <button class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center">
          <font-awesome-icon icon="undo" class="mr-2" />
          Reset
        </button>
        <button class="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center justify-center">
          <font-awesome-icon icon="download" class="mr-2" />
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CanViewer from './components/CanViewer.vue'

const canViewer = ref(null)
const baseColor = ref('#FF0000')
const rotationSpeed = ref(1)

const updateBaseColor = (event) => {
  if (canViewer.value) {
    canViewer.value.updateColor(event.target.value)
  }
}

const updateTexture = (event) => {
  const file = event.target.files[0]
  if (file && canViewer.value) {
    const reader = new FileReader()
    reader.onload = (e) => {
      canViewer.value.updateTexture(e.target.result)
    }
    reader.readAsDataURL(file)
  }
}

const updateRotationSpeed = () => {
  if (canViewer.value) {
    canViewer.value.updateRotationSpeed(rotationSpeed.value)
  }
}
</script>