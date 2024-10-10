
import { defineEventHandler } from 'h3';
import fs from 'fs';
import path from 'path';

export default defineEventHandler((event) => {
    const filePath = path.join(process.cwd(), 'server/resources/products.json');

    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        const products = JSON.parse(data);

        return { products: products}; 
    } catch (e) {
        return { "error": "can't reach products" };
    }
})