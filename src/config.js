process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'local';


let urlDB
if (process.env.NODE_ENV === 'local'){
	urlDB = 'mongodb://localhost:27017/AplicacionMongo';
}
else {
	urlDB = 'mongodb+srv://angie123:angie123@cluster0.diiyt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
}

process.env.URLDB = urlDB
