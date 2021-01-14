var express = require('express')
var app = express()
var ObjectId = require('mongodb').ObjectId

app.get('/', function(req, res, next) {	
	req.db.collection('employees').find().sort({"_id": -1}).toArray(function(err, result) {
		if (err) {
			req.flash('error', err)
			res.render('user/list', {
				title: 'HTC Emolpyee List', 
				data: ''
			})
		} else {
			res.render('user/list', {
				title: 'HTC Emolpyee List', 
				data: result
			})
		}
	})
})

app.get('/add', function(req, res, next){	
	res.render('user/add', {
		title: 'Add HTC Employee Details',
		name: '',
		age: '',
		email: '',
		mobile: '',
		address :''		
	})
})

// ADD NEW USER POST ACTION
app.post('/add', function(req, res, next){	
	req.assert('name', 'Name is required').notEmpty()           //Validate name
	req.assert('age', 'Age is required').notEmpty()             //Validate age
    req.assert('email', 'A valid email is required').isEmail()  //Validate email
    req.assert('mobile', 'Mobile is required').notEmpty()	//Validate mobile
    req.assert('address', 'Address is required').notEmpty()	//Validate address

    var errors = req.validationErrors()
    
    if( !errors ) {   
		
		var user = {
			name: req.sanitize('name').escape().trim(),
			age: req.sanitize('age').escape().trim(),
			email: req.sanitize('email').escape().trim(),
			mobile: req.sanitize('mobile').escape().trim(),
			address: req.sanitize('address').escape().trim(),
		}
				 
		req.db.collection('employees').insert(user, function(err, result) {
			if (err) {
				req.flash('error', err)
				
				res.render('user/add', {
					title: 'Add HTC Employee Details',
					name: user.name,
					age: user.age,
					email: user.email,
					mobile: user.mobile,
					address: user.address
				})
			} else {				
				req.flash('success', 'HTC Employee Details Added successfully!')
								
				res.redirect('/users')
			}
		})		
	}
	else {   
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})				
		req.flash('error', error_msg)		
		 
        res.render('user/add', { 
            title: 'Add HTC Employee Details',
            name: req.body.name,
            age: req.body.age,
            email: req.body.email,
            mobile: req.body.mobile,
            address: req.body.address,
        })
    }
})

app.get('/edit/(:id)', function(req, res, next){
	var o_id = new ObjectId(req.params.id)
	req.db.collection('employees').find({"_id": o_id}).toArray(function(err, result) {
		if(err) return console.log(err)
		
		if (!result) {
			req.flash('error', 'User not found with id = ' + req.params.id)
			res.redirect('/users')
		}
		else { 
			res.render('user/edit', {
				title: 'Edit User', 
				id: result[0]._id,
				name: result[0].name,
				age: result[0].age,
				email: result[0].email,
				mobile: result[0].mobile,
				address: result[0].address,					
			})
		}
	})	
})

app.put('/edit/(:id)', function(req, res, next) {
	req.assert('name', 'Name is required').notEmpty()           //Validate name
	req.assert('age', 'Age is required').notEmpty()             //Validate age
    req.assert('email', 'A valid email is required').isEmail()  //Validate email
    req.assert('mobile', 'Mobile Number is required').notEmpty() //Validate mobile
	req.assert('address', 'Address is required').notEmpty()      //Validate address

    var errors = req.validationErrors()

    if( !errors ) {  
		
		var user = {
			name: req.sanitize('name').escape().trim(),
			age: req.sanitize('age').escape().trim(),
			email: req.sanitize('email').escape().trim(),
			mobile: req.sanitize('mobile').escape().trim(),
			address: req.sanitize('address').escape().trim(),
		}
		
		var o_id = new ObjectId(req.params.id)
		req.db.collection('employees').update({"_id": o_id}, user, function(err, result) {
			if (err) {
				req.flash('error', err)
				
				res.render('user/edit', {
					title: 'Edit User',
					id: req.params.id,
					name: req.body.name,
					age: req.body.age,
					email: req.body.email,
					mobile: req.body.mobile,
					address: req.body.address
				})
			} else {
				req.flash('success', 'HTC Employee Data updated successfully!')
				res.redirect('/users')
			}
		})		
	}
	else {   
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)
		 
        res.render('user/edit', { 
            title: 'Edit User',            
			id: req.params.id, 
			name: req.body.name,
			age: req.body.age,
			email: req.body.email,
			mobile: req.body.mobile,
			address: req.body.address,
        })
    }
})

// DELETE USER
app.delete('/delete/(:id)', function(req, res, next) {	
	var o_id = new ObjectId(req.params.id)
	req.db.collection('employees').remove({"_id": o_id}, function(err, result) {
		if (err) {
			req.flash('error', err)
			// redirect to users list page
			res.redirect('/users')
		} else {
			req.flash('success', 'HTC Employee deleted successfully! id = ' + req.params.id)
			// redirect to users list page
			res.redirect('/users')
		}
	})	
})

module.exports = app
