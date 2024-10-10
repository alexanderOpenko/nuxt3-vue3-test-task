
import { defineEventHandler } from 'h3';
import fs from 'fs';
import path from 'path';

export default defineEventHandler((event) => {
    const id = getRouterParam(event, 'id')
    const filePath = path.join(process.cwd(), 'server/resources/products.json')

    if (!id || isNaN(Number(id))) {
        return { error: 'Invalid ID: ID is either missing or not a number' }
    }
    
    try {
        const data = fs.readFileSync(filePath, 'utf-8')
        const products = JSON.parse(data)
        const product = products.filter((el) => { 
            return el.id === Number(id) 
        })
        
        if (!product.length) {
            return { "error": "There is no such product" }
        }

        return { 
            product: product[0]
        }; 
    } catch (e) {
        return { "error": "can't reach products" }
    }
})