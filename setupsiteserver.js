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

			let query = {"site":site}

			console.log("query:" query)

			db.collection("sites").find(query).limit(1).toArray((siteError, siteResult) => {
				if(siteError) throw siteError;

				console.log(siteResult)

				if(siteResult.length === 0){
					let newsite = {"site":site}
					db.collection("sites").insert(newsite, (insertError, insertResult) => {
						if(insertError) throw insertError;

						console.log(insertResult)

					})
				} else {
					console.log("site exists")
					//site already exists, do nothing		
				}
			}) 
		}
	})
})
