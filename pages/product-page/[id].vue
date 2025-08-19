<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { cardConfig } from '/utils/cardConfig.js'
import { products as productsJSON } from '~/public/products'

const route = useRoute()
const id = route.params.id
const product = ref<any>({})

function getProduct() {
  const found = productsJSON.find(p => String(p.id) === String(id))
  if (found) {
    product.value = found
  }
}

onMounted(() => {
  getProduct()
})
</script>

<template>
  <div class="content-container py-8 px-4">
    <div v-if="Object.keys(product).length > 0" class="max-w-2xl mx-auto">
      <UCard :ui="cardConfig">
        <template #header>
          <div class="relative pt-[100%]">
            <img
              :src="product.image"
              :alt="product.name"
              class="absolute top-0 bottom-0 right-0 left-0 h-full object-cover w-full rounded-lg"
            />
          </div>
        </template>

        <template #footer>
          <h1 class="text-2xl font-bold mb-2">{{ product.name }}</h1>
          <p class="text-lg font-semibold text-green-600 mb-4">
            Price: ${{ product.price }}
          </p>
          <p class="text-gray-700">
            {{ product.description }}
          </p>
        </template>
      </UCard>
    </div>

    <div v-else>
      <p class="text-center text-gray-600">Product not found...</p>
    </div>
  </div>
</template>
