import { createApp } from 'vue'
import App from './App.vue'
import components from '@/components/UI'

const app = createApp(App);

components.forEach(customComponent => {
    app.component(customComponent.name, customComponent)
})

app.mount('#app')
