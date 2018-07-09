// admin.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// License: MIT

'use strict';

const express = require('express');
const router = express.Router();
const uuidv4 = require('uuid/v4');
const moment = require('moment');

const mongoose = require('mongoose');

const GameDeveloper = mongoose.model('GameDeveloper');
const GameDevTeam = mongoose.model('GameDevTeam');
const GameDevStudio = mongoose.model('GameDevStudio');
const GameDevCompany = mongoose.model('GameDevCompany');
const GameInstance = mongoose.model('GameInstance');
const GameScore = mongoose.model('GameScore');
const Game = mongoose.model('Game');

const User = mongoose.model('User');

module.exports = (app) => {
  app.use('/admin', router);
};

router.param('gameId', (req, res, next, gameId) => {
  Game
  .findById(gameId)
  .then((game) => {
    res.locals.game = game;
    next();
  })
  .catch(next);
});

router.param('developerId', (req, res, next, developerId) => {
  GameDeveloper
  .findById(developerId)
  .then((developer) => {
    res.locals.developer = developer;
    next();
  })
  .catch(next);
});

router.param('teamId', (req, res, next, teamId) => {
  GameDevTeam
  .findById(teamId)
  .then((devTeam) => {
    res.locals.devTeam = devTeam;
    next();
  })
  .catch(next);
});

router.param('studioId', (req, res, next, studioId) => {
  GameDevStudio
  .findById(studioId)
  .then((devStudio) => {
    res.locals.devStudio = devStudio;
    next();
  })
  .catch(next);
});

router.param('companyId', (req, res, next, companyId) => {
  GameDevCompany
  .findById(companyId)
  .then((devCompany) => {
    res.locals.devCompany = devCompany;
    next();
  })
  .catch(next);
});

/*
 * GAME DEVELOPER
 */

router.post('/game-developer/:developerId', (req, res, next) => {
  res.locals.developer.name = req.body.name;
  res.locals.developer.headline = req.body.headline;
  res.locals.developer.description = req.body.description;
  res.locals.developer
  .save()
  .then((developer) => {
    res.locals.developer = developer;
    res.redirect(`/admin/game-developer/${developer._id}`);
  })
  .catch(next);
});

router.get('/game-developer/:developerId', (req, res) => {
  res.render('admin/game-developer-edit', res.locals.developer);
});

router.post('/game-developer', (req, res, next) => {
  GameDeveloper
  .create({
    team: req.body.teamId,
    name: req.body.name,
    title: req.body.title,
    creditAs: req.body.creditAs,
    bio: req.body.bio
  })
  .then((gameDeveloper) => {
    res.redirect(`/admin/game-developer/${gameDeveloper._id}`);
  })
  .catch(next);
});

router.get('/game-developer-create', (req, res) => {
  res.render('admin/game-developer-create');
});

router.get('/game-developer', (req, res, next) => {
  var viewModel = { };
  GameDeveloper
  .find()
  .sort({ name: 1 })
  .limit(10)
  .populate('team')
  .then((developers) => {
    viewModel.developers = developers;
    res.render('admin/game-developer-list', viewModel);
  })
  .catch(next);
});

/*
 * GAME
 */

router.get('/game/:gameId/edit', (req, res, next) => {
  var viewModel = { };
  Game
  .findById(req.params.gameId)
  .then((game) => {
    if (!game) {
      return Promise.reject(
        new Error('The selected game does not exist.')
      );
    }
    viewModel.game = game;
    res.render('admin/game/edit', viewModel);
  })
  .catch(next);
});

router.post('/game/:gameId', (req, res, next) => {
  res.locals.game.slug = req.body.slug;
  res.locals.game.technology = req.body.technology;
  res.locals.game.title = req.body.title;
  res.locals.game.headline = req.body.headline;
  res.locals.game.description = req.body.description;
  res.locals.game.unity3d.configFile = req.body.configFile;
  res.locals.game.unity3d.engineFile = req.body.engineFile;
  res.locals.game.tags = req.body.tags.split(' ');
  res.locals.game
  .save()
  .then((game) => {
    res.locals.game = game;
    res.redirect(`/admin/game/${game._id}`);
  })
  .catch(next);
});

router.get('/game/:gameId', (req, res, next) => {
  var viewModel = { };
  Game
  .findById(req.params.gameId)
  .then((game) => {
    if (!game) {
      return Promise.reject(
        new Error('The selected game does not exist.')
      );
    }
    viewModel.game = game;
    return GameInstance
    .find({ game: game._id })
    .sort({ created: -1 })
    .limit(25)
    .populate('user')
    .lean();
  })
  .then((instances) => {
    viewModel.instances = instances;
    res.render('admin/game/view', viewModel);
  })
  .catch(next);
});

router.post('/game', (req, res, next) => {
  Game.create({
    authToken: uuidv4(),
    accessToken: uuidv4(),
    slug: req.body.slug,
    technology: req.body.technology,
    title: req.body.title,
    headline: req.body.headline,
    description: req.body.description,
    'unity3d.configFile': req.body.configFile,
    'unity3d.engineFile': req.body.engineFile,
    tags: req.body.tags.split(' ')
  })
  .then((game) => {
    res.redirect(`/admin/game/${game._id}`);
  })
  .catch(next);
});

router.get('/game', (req, res) => {
  res.render('admin/game/create');
});

router.get('/game-management', (req, res, next) => {
  var viewModel = { };
  Game
  .find()
  .limit(10)
  .populate('team')
  .then((games) => {
    viewModel.games = games;
    res.render('admin/game-management', viewModel);
  })
  .catch(next);
});

router.get('/graph/plays-per-hour', (req, res) => {
  var viewModel = { };
  var startDate = moment().subtract(24, 'hour').toDate();
  GameScore
  .aggregate([
    {
      $match: {
        finished: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$finished' },
          month: { $month: '$finished' },
          day: { $dayOfMonth: '$finished' },
          hour: { $hour: '$finished' }
        },
        minutesPlayed: { $sum: '$minutesPlayed' },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        date: {
          $dateFromParts: {
            year: '$_id.year',
            month: '$_id.month',
            day: '$_id.day',
            hour: '$_id.hour'
          }
        },
        minutesPlayed: '$minutesPlayed',
        count: '$count'
      }
    }
  ])
  .then((graphData) => {
    viewModel.graphData = graphData;
    res.status(200).json(viewModel);
  })
  .catch((error) => {
    console.log('admin graph data error', { error: error });
    res
    .status(error.code || error.statusCode || 500)
    .json({ message: error.message || 'Internal server error' });
  });
});

router.get('/', (req, res, next) => {
  var viewModel = { };
  Game
  .count()
  .then((gameCount) => {
    viewModel.gameCount = gameCount;
    return User.count();
  })
  .then((userCount) => {
    viewModel.userCount = userCount;
    res.render('admin/index', viewModel);
  })
  .catch(next);
});
