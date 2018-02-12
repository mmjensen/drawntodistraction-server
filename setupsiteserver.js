const mongodb= require('mongodb')

mongodb.MongoClient.connect(url, (error, client) => {
	if (error){
		console.log("CONNECTION ERROR")
		return process.exit(1)	
	} 

	var db = client.db('drawntodistraction')

	db.collection("sessions").find({}).toArray((err, result) => {
		if (err) throw err;

		for(var i = 0; i < result.length; i++){
			let site = result[i].site

			db.collection("sites").find({"site":site}).toArray((error, res) => {
				if(typeof res !== 'undefined' && res.length > 0){
					//site already exists in db
					//do nothing?
				} else {
					let newsite = {"site":site}
					db.collection("sites").insert(newsite, (e, r) => {
						if(e) throw e;

						console.log(r)

					})
				}
			}) 
		}
	})

	db.close()
})
