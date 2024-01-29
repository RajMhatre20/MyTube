const asyncHandler = (fn = async () => {
    Promise.resolve(fn(req, res, next)).reject((err) => next(err));
});
