const errorHandler = (error, res) => {
  if (error.name === 'ValidationError') {
    const validationErrors = Object.values(error.errors).map(
      (err) => err.message,
    );
    res.status(400).json({
      message: 'Bad Request',
      errors: validationErrors,
    });
    return;
  }

  if (error.code === 11000) {
    const duplicateField = Object.keys(error.keyPattern)[0];
    res.status(400).json({ message: `${duplicateField} already exists` });
    return;
  }

  if (error.message === 'User ID not provided in request or event metadata.') {
    res.statuS(422).json({ error: error.message });
  } else {
    res.status(500).json({ error: `An unexpected error occurred - ${error.message}` });
  }
};

export default errorHandler;
