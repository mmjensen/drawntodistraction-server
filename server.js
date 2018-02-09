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

	app.get('/:id/sessions', (req, res) => {
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

	app.get('/:cioid/sites', (req,res) => {
		db.collection('sessions')
		.find({userID:req.params.cioid})
		.toArray((error, sessions) => {
			if(error){
				sendStatus(400)
			}

			let result = processSites(sessions)
			res.send(result)

		})
	})

  	app.listen(3000)
})

function processSites(sessions){
	let sites = []
	let result = []

	//Run through the sessions and bukcet them in sites
	for(var i = 0; i < sessions.length; i++){
		var index = sites.indexOf(sessions[i].name)
		if(index >= 0){
			result[index].totalDuration += (sessions[i].end - sessions[i].start)
			result[index].visits += 1
			//result[index].sessions.push(sessions[i])			
		} else {
			sites.push(sessions[i].name)
			let newSite = {site:sessions[i].name}
			newSite["totalDuration"] = sessions[i].end - sessions[i].start
			newSite["visits"] = 1
			//newSite["sessions"] = [sessions[i]]
			result.push(newSite)
		}	
	}

	return result

}

