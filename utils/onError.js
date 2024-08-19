module.exports = async ( err, req, res, next ) => {
  console.log(err)
  if (res) {

    const status = err.status || err.statusCode || 500

    const message = err.message || 'Something went wrong. Try again later'
    return res.status( status ).send( {
            success: false,
            errors: message,
            data: null
        } );
  }
}