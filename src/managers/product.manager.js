import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts(limit) {
    try {
      const productsData = fs.readFileSync(this.path, 'utf-8');
      const products = JSON.parse(productsData);
      
    if (limit) {
      products = products.slice(0, limit);
    }return products;
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      return [];
    }
  }

  async createProduct(obj) {
    try {
      const product = {
        id: uuidv4(),
        status: true,
        ...obj,
      };
      const products = await this.getProducts();
      products.push(product);
      fs.writeFileSync(this.path, JSON.stringify(products, null, 2));
      return product;
    } catch (error) {
      console.error('Error al crear el producto:', error);
      return null;
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProducts();
      const productExist = products.find((p) => p.id === id);
      if (!productExist) return null;
      return productExist;
    } catch (error) {
      console.log(error);
    }
  }

  async updateProduct(obj, id) {
    try {
      const products = await this.getProducts();
      let productExist = await this.getProductById(id);
      if (!productExist) return null;
      productExist = { ...productExist, ...obj };
      const newArray = products.filter((u) => u.id !== id);
      newArray.push(productExist)
      await fs.promises.writeFile(this.path, JSON.stringify(newArray));
      return productExist;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    if (products.length > 0) {
      const productExist = await this.getProductById(id);
      if (productExist) {
        const newArray = products.filter((u) => u.id !== id);
        await fs.promises.writeFile(this.path, JSON.stringify(newArray));
        return productExist
      } 
    } else return null
  }

  async deleteFile() {
    try {
      await fs.promises.unlink(this.path);
      console.log("archivo eliminado");
    } catch (error) {
      console.log(error);
    }
  }
}