const mongodb= require('mongodb')

const url = 'mongodb://localhost:27017'

mongodb.MongoClient.connect(url, (error, client) => {
	if (error){
		console.log("CONNECTION ERROR")
		return process.exit(1)	
	} 

	var db = client.db('drawntodistraction')

	db.collection("sessions").find({}).toArray((sessionError, sessionResult) => {
		if (sessionError) throw sessionError;

		for(var i = 0; i < sessionResult.length; i++){
			let site = sessionResult[i].site

			db.collection("sites").find({"site":site}).toArray((siteError, siteResult) => {
				if(siteError) throw siteError;

				if(typeof siteResult !== 'undefined' && siteResult.length > 0){
					//site already exists in db
					//do nothing?
				} else {
					let newsite = {"site":site}
					db.collection("sites").insert(newsite, (insertError, insertResult) => {
						if(insertError) throw insertError;

						console.log(insertResult)

					})
				}
			}) 
		}
	})
})
