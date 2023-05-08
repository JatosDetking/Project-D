exports.get404 = (req,res,next) => {
    const error = new Error('Cant handle route');
    error.status = 404;
    next(error);
}

exports.get500 = (error,req,res,next) => {
    console.log(error.status || 500)
    res.status(500);
    console.trace();
    res.send([{
        error: {
            message: error.message
        }
    }])
}