try {
  console.log('Requiring Machine...');
  require('./models/Machine');
  console.log('Requiring Worker...');
  require('./models/Worker');
  console.log('Requiring User...');
  require('./models/User');
  console.log('Requiring models/index...');
  require('./models/index');
  console.log('All modules loaded!');
} catch (err) {
  console.error(err);
}
