// app/controllers/contato.js

module.exports = function(app){

	var sanitize = require('mongo-sanitize');

	var Contato = app.models.contato;

	var controller = {};

	controller.listaContatos = function(req, res) {
		Contato.find().populate('emergencia').exec()
		.then(function(contatos) {
			res.json(contatos);
		},
		function erro(erro){
			console.error(erro);
			res.status(500).json(erro);
		});
	};

	controller.obtemContato = function(req, res){
		var _id = sanitize(req.params.id);
		Contato.findById(_id).exec()
		.then(
			function(contato) {
				if(!contato) throw new Error("Contato não encontrado");
				console.log(contato);
				res.json(contato);
			},
			function(erro){
				console.log(erro);
				res.status(404).json(erro);
			}
		);
	};

	controller.removeContato = function(req, res) {
		var  _id = req.params.id;
		Contato.remove({"_id" : _id}).exec()
		.then(function() {
			res.status(204).end();
		},
		function(erro) {
			return console.error(erro);
		}
		);
	};
	controller.salvaContato = function(req, res) {
		var _id = req.body._id;

		var dados = {
			"nome" : req.body.nome,
			"email" : req.body.email,
			"emergencia" : req.body.emergencia || null
		};

		req.body.emergencia = req.body.emergencia || null;

		if(_id) {
			Contato.findByIdAndUpdate(_id, dados).exec()
			.then(function(contato) {
				res.json(contato);
			},
			function(erro){
				console.error(erro);
				res.status(500).json(erro);
			});
		} else{
			Contato.create(req.body)
			.then(function(contato) {
				res.status(201).json(contato);
			},
			function(erro) {
				console.log(erro);
				res.status(500).json(erro);
			});
		}
	};

	function adiciona(contatoNovo) {
		var contato = new Contato(req.body);
		contato.save(function(erro, contato) {
			if(erro){
				res.status(500).end();
				console.log(erro);
			} else {
				res.json(contato);
			}
		});
	};

	function atualiza(contatoAlterar) {
		
	};
	return controller;
};