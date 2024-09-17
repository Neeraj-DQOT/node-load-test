// Import the Faker library
const { faker } = require("@faker-js/faker");

// Function to generate fake categories
function generateCategories(count) {
  const categories = [];
  for (let i = 0; i < count; i++) {
    categories.push({
      id: i + 1,
      category_name: faker.commerce.department(),
      description: faker.lorem.sentence(),
      created_at: faker.date.past(),
    });
  }
  return categories;
}

// Function to generate fake subcategories
function generateSubCategories(count, categories) {
  const subcategories = [];
  for (let i = 0; i < count; i++) {
    subcategories.push({
      id: i + 1,
      subcategory_name: faker.commerce.productAdjective(),
      category_id: faker.helpers.arrayElement(categories).id, // Randomly assign a category
      description: faker.lorem.sentence(),
      created_at: faker.date.past(),
    });
  }
  return subcategories;
}

// Function to generate fake products
function generateProducts(count, categories, subcategories) {
  const products = [];
  for (let i = 0; i < count; i++) {
    products.push({
      id: i + 1,
      product_name: faker.commerce.productName(),
      category_id: faker.helpers.arrayElement(categories).id, // Randomly assign a category
      subcategory_id: faker.helpers.arrayElement(subcategories).id, // Randomly assign a subcategory
      price: faker.commerce.price(),
      stock: faker.number.int({ min: 100, max: 10000 }), // Use faker.random.numeric() to generate a number
      description: faker.lorem.paragraph(),
      created_at: faker.date.past(),
    });
  }
  return products;
}

// // Example Usage
// const categories = generateCategories(5); // Generate 5 categories
// const subcategories = generateSubCategories(10, categories); // Generate 10 subcategories
// const products = generateProducts(20, categories, subcategories); // Generate 20 products

// console.log({ categories, subcategories, products });

module.exports = {
  generateCategories,
  generateProducts,
  generateSubCategories,
};
