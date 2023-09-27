"use strict";
const productsJSON = require('../../data/productsDataBase.json')
const productDB = productsJSON.map(({name, price, description, discount, category,image}) => {
  return {
    name,
    price,
    discount,
    categoryId: category === "visited" ? 1: 2,
    description,
    image,
    createdAt: new Date(),
    updatedAt: new Date()
  }
})
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Products",
      productDB,
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Categories", null, {});
  },
};
