const express = require('express')
const bodyParser = require('body-parser')
const errorhandler = require('errorhandler')
const mongodb= require('mongodb')
const logger = require('morgan')

const url = 'mongodb://localhost:27017'

const app = express();

console.log("Server running")

app.use(bodyParser.json())
app.use(logger('dev'))

mongodb.MongoClient.connect(url, (error, client) => {
	if (error){
		console.log("CONNECTION ERROR")
		return process.exit(1)	
	} 

	var db = client.db('drawntodistraction')

	app.get('/sessions/:id', (req, res) => {
		if(!req.params.id){
			console.log("No user ID provided!")
			res.send("No user ID supplied")
		} else {

			var query = { userID: req.params.id };

			db.collection('sessions')
				.find(query)
				.toArray((error, sessions) => {
					if (error) return next(error)
						res.send(sessions)
			})
		}
	})

	app.post('/sessions', (req,res) => {
		let newSession = req.body
		if(req.body.userID){
			db.collection('sessions')
			.insertMany(newSession.sessions, (error, results) => {
				if (error){
					return next(error)	
				} 
				res.send(results)
			})
		} else {
			res.sendStatus(400)
		}
	})

  	app.listen(3000)
})
