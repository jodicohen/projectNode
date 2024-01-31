export const errorHandling=(err, req, res, next) => {
    let statusCode = res.statusCode || 500;
    let message = err.message || "מצטערים התרחשה שגיאה"
    res.status(statusCode).send(message)
}
