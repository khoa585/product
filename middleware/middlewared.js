module.exports = function(req,res,next) {
	if(!req.sessionID){
		var SessionID =  req.sessionID;
		db.get('Sessions').push({
		 	id : SessionID
		}).write()
	}
	next();
}