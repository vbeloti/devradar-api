const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../webshocket');

class DevController {
  async index(req, res) {
    const devs = await Dev.find();

    return res.json(devs);
  }

  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body;

    let dev = await Dev.findOne({ github_username });

    if (dev) {
      return res.status(400).json({ error: 'User already exists in database' });
    }

    const response = await axios.get(
      `https://api.github.com/users/${github_username}`
    );

    const { name = login, avatar_url, bio } = response.data;

    const techsArray = parseStringAsArray(techs);

    const location = {
      type: 'Point',
      coordinates: [longitude, latitude],
    };

    dev = await Dev.create({
      github_username,
      name,
      avatar_url,
      bio,
      techs: techsArray,
      location,
    });

    const sendSocketMessageTo = findConnections(
      { latitude, longitude },
      techsArray
    );

    sendMessage(sendSocketMessageTo, 'new-dev', dev)

    return res.json(dev);
  }

  async update(req, res) {
    const github_username = req.params.id;
    const { name, bio, avatar_url, techs, latitude, longitude } = req.body;

    const dev = await Dev.find({ github_username });

    if (dev.length === 0) {
      return res.status(400).json({ error: 'Dev does not exists' });
    }

    if (!name || !bio || !avatar_url || !techs || !latitude || !longitude) {
      return res.status(400).json({ error: 'Empty fields are not allowed' });
    }

    const updatedDev = await Dev.findOneAndUpdate(
      { github_username },
      {
        name,
        bio,
        avatar_url,
        techs: parseStringAsArray(techs),
        latitude,
        longitude,
      },
      { new: true }
    );

    return res.json(updatedDev);
  }

  async delete(req, res) {
    const github_username = req.params.id;

    const devDeleted = await Dev.deleteOne({ github_username });

    if (devDeleted.deletedCount === 0) {
      return res.status(400).json({ error: 'Dev does not exists...' });
    }

    return res.json({ message: 'Dev successfully deleted' });
  }
}

module.exports = DevController;
