import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faPalette, 
  faImage, 
  faRotate,
  faDownload,
  faUndo,
  faRedo 
} from '@fortawesome/free-solid-svg-icons'

library.add(faPalette, faImage, faRotate, faDownload, faUndo, faRedo)

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')