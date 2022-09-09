
exports.handler = (context, event, callback) => {
    console.log(event);
    const phone = "+16137977535";

    callback(null, {
      phone,
      quote: 'test',
      message: 'testing!!'
    });
  };
  