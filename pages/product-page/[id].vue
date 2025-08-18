<script setup lang="ts">
import { ref, onMounted } from 'vue'
    const route = useRoute();
    const id = route.params.id
    const product = ref({})

    async function getProduct() {
    try {
        const response = await $fetch(`/product/${id}`)

        if (!response.error) {
            product.value = response.product            
        } else {
            throw new Error(response.error)
        }
    } catch (e) {
        alert(e)
    }
}

onMounted(() => {
    getProduct()
})
</script>

<template>
    <div class="content-container py-8 px-4">
        <div v-if="Object.keys(product).length > 0" class="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-6">
            <div class="mb-4">
                <img :src="product.image" :alt="product.name" class="w-full max-h-[500px] h-full object-contain rounded-lg"/>
            </div>

            <div class="mb-2">
                <h1 class="text-3xl font-bold text-gray-800">{{ product.name }}</h1>
            </div>

            <div class="mb-4">
                <p class="text-xl font-semibold text-green-600">
                    Price: ${{ product.price }}
                </p>
            </div>

            <div>
                <p class="text-gray-700">
                    {{ product.description }}
                </p>
            </div>
        </div>

        <div v-else>
            <p class="text-center text-gray-600">Loading product details...</p>
        </div>
    </div>
</template>