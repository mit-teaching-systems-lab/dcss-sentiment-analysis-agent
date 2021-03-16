let fs;

try {
  // Node 14.x
  fs = require('fs/promises');
} catch (error) {
  // Node 12.x
  fs = require('fs').promises;
}

const escapeStringRegexp = require('escape-string-regexp');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function analyze(input) {
  const { stdout, stderr } = await exec(`./sentiment.js -i '${escapeStringRegexp(input)}'`);
  if (stderr) {
    return stderr;
  }
  return JSON.parse(stdout);
}

const express = require('express');
const SocketIO = require('socket.io');
const PORT = process.env.PORT || 4000;

const files = {
  '/': '/index.html',
};

const app = express();

app.get('*', async (req, res) => {
  let file = files['/'];
  if (files[req.path]) {
    file = files[req.path];
  }
  const contents = await fs.readFile(`${__dirname}${file}`, 'utf8');
  res.send(contents.replace('/***PORT***/', `${PORT}`));
});

const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));
const io = SocketIO(server);

const cache = {};
const count = 0;

io.on('connection', (socket) => {
  const {
    agent,
    user,
    chat
  } = socket.handshake.auth;

  socket.join(user.id);

  console.log('Received agent:', agent);
  console.log('Received chat:', chat);
  console.log('Received user:', user);
  console.log('socket.id', socket.id);

  if (!cache[user.id]) {
    cache[user.id] = {
      agent,
      chat,
      user,
      count,
      rx: [],
      tx: []
    };
    // Only send the welcome message when this is the
    // first time the specific user is connecting.
    //
    // Send the response to the specified private
    // channel for this client socket connection.
    io.to(user.id).emit('interjection', {
      message: `Hello, I will analyze all of your messages for sentiment`
    });
  }

  /*
    THIS IS THE IMPORTANT PART FOR CONSTRUCTING AN AGENT THAT
    TEACHER MOMENTS CAN INTERACT WITH
  */
  socket.on('request', async payload => {
    console.log('request', payload);
    if (!cache[user.id]) {
      // The session has been ended!
      return;
    }

    // "Process" the incoming data
    const {
      vote
    } = await analyze(payload.value);

    const result = vote === cache[user.id].agent.configuration.vote;
    const response = {
      ...payload,
      result
    };

    if (result) {
      const message = vote === 'negative'
        ? 'Excuse me, but that was a little negative. Please be nicer.'
        : 'Thanks for being so positive!';

      io.to(user.id).emit('interjection', {
        message
      });
    }

    // Send the response to the specified private
    // channel for this client socket connection.
    io.to(user.id).emit('response', response);
  });

  socket.on('end', ({ auth, chat, user }) => {
    if (cache[user.id]) {
      io.to(user.id).emit('interjection', {
        message: 'Goodbye!'
      });
      cache[user.id] = null;
    }
  });
  /*
    END
  */
});
