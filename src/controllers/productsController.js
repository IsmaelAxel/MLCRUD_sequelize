const db = require('../database/models')

const fs = require('fs');
const path = require('path');
const { readJSON, writeJSON } = require('../data');
const { error } = require('console');
const { response } = require('express');
const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {

		db.Product.findAll()
			.then(products => {
				return res.render("products",{
					products,
					toThousand
				})
			})
			.catch(error => console.log(error))
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		db.Product.findByPk(req.params.id)
			.then(product => {
			return res.render("detail",{
				...product.dataValues, //aca va el dataValues porque aca estamos aplicando el destructuring
				toThousand
				})
			})
	},

	// Create - Form to create
	create: (req, res) => {
		db.Category.findAll()
		.then(categories=>{
			return res.render('product-create-form',{
				categories
			})
		}).catch(error=>console.log(error))
		
	},

	// Create -  Method to store
	store: (req, res) => {
		db.Product.create({
			name: req.body.name,
			price: req.body.price,
			discount: req.body.discount || 0,
			categoryId: req.body.categoryId,
			description: req.body.description.trim(),
			image: req.file ? req.file.filename : null
		})
			.then(product => {
				console.log(product)
				return res.redirect('/products')
			}).catch(error=>console.log(error))
		
	},

	// Update - Form to edit
	edit: (req, res) => {
		// Do the magic
		const categories = db.Category.findAll()
		const producto = db.Product.findByPk(req.params.id)
		Promise.all([categories,producto])
		.then(([categories,producto]) => {
			return res.render('product-edit-form', {
				...producto.dataValues,
				categories
			})
		})
	

	},
	// Update - Method to update
	update: (req, res) => {
		// Do the magic
		db.Product.findByPk(req.params.id, {
			attributes: ['image']
		}).then(product => {
			db.Product.update({
				name : req.body.name.trim(),
				price : req.body.price,
				discount : req.body.discount || 0,
				description : req.body.description.trim(),
				category : req.body.categoryId,
				image : req.file ? req.file.filename : product.image
		},{
			where:{
				id: req.params.id
			}
		}).then(response => {
			console.log(response)
			return res.redirect('/products/detail/' + req.params.id)
		})
		}).catch(error=>console.log(error))


		
	},

	// Delete - Delete one product from DB
	destroy: (req, res) => {
		// Do the magic
		db.Product.destroy({
			where: {
				id: req.params.id
			}
		}).then(response => {
			console.log(response)
			return res.redirect('/products')
		}).catch(error => console.log(error))
	}
};

module.exports = controller;