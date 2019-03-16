const genRandomPassword = (randomRounds)=> {
	return Array(randomRounds)
		.fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz")
		.map(function(x) { return x[Math.floor(Math.random() * x.length)] })
    	.join('');
}

module.exports = {genRandomPassword}; 
