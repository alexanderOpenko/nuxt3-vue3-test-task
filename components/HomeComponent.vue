<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { cardConfig } from '/utils/cardConfig.js'

let products = ref([])
let categorizedProducts = ref([])
let activeFilterPriceBtn = ref("")
let activeSortOption = ref("")

async function getAllProducts() {
    try {
        const response = await $fetch('/products')

        if (!response.error) {
            products.value = response.products
            categorizeProducts()
        } else {
            throw new Error(response.error)
        }
    } catch (e) {
        alert(e)
    }
}

function categorizeProducts() {
    const prices = products.value.map(product => product.price).sort((a, b) => a - b)

    const third = Math.ceil(prices.length / 3)
    const cheapPrices = prices.slice(0, third)
    const mediumPrices = prices.slice(third, third * 2)
    const expensivePrices = prices.slice(third * 2)

    const categories = [
        { name: 'Cheap', products: cheapPrices },
        { name: 'Medium', products: mediumPrices },
        { name: 'Expensive', products: expensivePrices },
    ]

    categorizedProducts.value = categories.map(category => {
        return {
            ...category,
            products: products.value.filter(product =>
                category.products.includes(product.price)
            )
        }
    })
}

function setFilterPrice(priceRange) {
    products.value = categorizedProducts.value.find(category => category.name === priceRange).products

    if (activeSortOption.value === 'From higher') {
        products.value = products.value.sort((a, b) => b.price - a.price)
    }

    activeFilterPriceBtn.value = priceRange
}

function setSortOption(sortOption) {
    if (sortOption === "From lower") {
        products.value = products.value.sort((a, b) => a.price - b.price)
    } else {
        products.value = products.value.sort((a, b) => b.price - a.price)
    }

    activeSortOption.value = sortOption
}

function resetFilters() {
    activeFilterPriceBtn.value = ""
    activeSortOption.value = ""

    getAllProducts()
}

onMounted(() => {
    getAllProducts()
})
</script>

<template>
    <div class="home content-container !pt-10">
        <h1 class="text-center sm:text-2xl text-lg mb-4">
            All Products
        </h1>

        <div class="flex sm:flex-row flex-col">
            <div v-if="categorizedProducts.length > 0" class="sm:max-w-[30%] sm:mb-0 mb-4 mr-4 w-full">
                <UCard :ui="cardConfig">
                    <template #header>
                        <p class="mb-2 text-lg">
                            Filter products by price:
                        </p>

                        <UButton color="primary" v-for="(category, index) in categorizedProducts" 
                            :key="index" 
                            block
                            size="md" 
                            class="max-w-24 w-full mb-2" 
                            @click="setFilterPrice(category.name)" 
                            :variant="category.name === activeFilterPriceBtn
                                ? 'solid'
                                : 'outline'"
                            type="button"
                        >
                            {{ category.name }}
                        </UButton>

                        <p class="mb-2 text-lg">
                            Sort: 
                        </p>

                        <div>
                            <UButton color="primary" v-for="(sortOption, index) in ['From higher', 'From lower']" :key="index" 
                                size="md" 
                                class="mr-4 whitespace-nowrap max-w-28 w-full mb-2 justify-center" 
                                @click="setSortOption(sortOption)" 
                                :variant="sortOption === activeSortOption
                                    ? 'solid'
                                    : 'outline'"
                                type="button"
                            >
                                {{ sortOption }}
                            </UButton>
                        </div>

                        <UButton 
                            color="secondary" 
                            block
                            size="md" 
                            @click="resetFilters"
                            variant="link"
                            type="button"
                        >
                            Reset Filters
                        </UButton>
                    </template>
                </UCard>
            </div>

            <div v-if="products.length > 0" class="sm:max-w-[70%] w-full">
                <div class="products grid lg:grid-cols-3 sm:gap-4 grid-cols-2 gap-2">
                    <div v-for="product in products" :key="product.id" class="product">
                        <NuxtLink :to="{ name: 'product-page-id', params: { id: product.id } }"> 
                            <UCard :ui="cardConfig">
                                <template #header>
                                    <div class="relative pt-[100%]">
                                        <img :src="product.image" :alt="product.name" 
                                        class="absolute top-0 bottom-0 right-0 left-0 h-full object-cover w-full"
                                        />
                                    </div>
                                </template>

                                <template #footer>
                                    <h2>{{ product.name }}</h2>
                                    <p>Price: {{ product.price }} $</p>
                                </template>
                            </UCard>
                        </NuxtLink>
                    </div>
                </div>
            </div>
            <div v-else>
                <p>Loading products...</p>
            </div>
        </div>
    </div>
</template>
