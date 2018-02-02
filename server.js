const express = require('express')
const bodyParser = require('body-parser')
const errorhandler = require('errorhandler')
const mongodb= require('mongodb')
const logger = require('morgan')

const url = 'mongodb://localhost:27017'

const app = express();

console.log("Server running")

app.use(bodyParser.json({
	parameterLimit: 100000,
    limit: '50mb',
    extended: true
}))
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
		if(newSession.userID && newSession.sessions){
			db.collection('sessions')
			.insertMany(newSession.sessions, (error, results) => {
				if (error){
					res.send(405)	
				} 
				res.send(results)
			})
		} else {
			res.sendStatus(400)
		}
	})

  	app.listen(3000)
})
