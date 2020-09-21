const { Router } = require('express');
const DevController = require('./controllers/DevController');
const SearchController = require('./controllers/SearchController');

const devController = new DevController();
const searchController = new SearchController();

const routes = Router();

routes.get('/devs', devController.index);
routes.post('/devs', devController.store);
routes.put('/devs/:id', devController.update);
routes.delete('/devs/:id', devController.delete);

routes.get('/search', searchController.index);

module.exports = routes;
