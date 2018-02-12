const mongodb= require('mongodb')

const url = 'mongodb://localhost:27017'

var sessions = []

mongodb.MongoClient.connect(url, (error, client) => {
	if (error){
		console.log("CONNECTION ERROR")
		return process.exit(1)	
	} 

	var db = client.db('drawntodistraction')

	db.collection("sessions").find({}).toArray((sessionError, sessionResult) => {
		if (sessionError) throw sessionError;

		console.log(sessionResult)

		sessions = sessionResult

		var i = 0

		recursiveAddToDB(i, db)

	})
})


function recursiveAddToDB(i, db){
	if(i < sessions.length){
		let site = sessions[i].site

		let query = {"site":site}

		console.log("site: " + site)
		db.collection("sites").find(query).limit(1).toArray((siteError, siteResult) => {
			if(siteError) throw siteError;

			console.log(siteResult)

			if(typeof siteResult !== 'undefined' && siteResult.length > 0){
				console.log("site exists")
				//site already exists, do nothing		
				recursiveAddToDB(i+1, db)
			} else {
				let newsite = {"site":site}
				db.collection("sites").insert(newsite, (insertError, insertResult) => {
					if(insertError) throw insertError;

					console.log(insertResult)
					recursiveAddToDB(i+1, db)

				})
			}
		})
	} 
		
} 