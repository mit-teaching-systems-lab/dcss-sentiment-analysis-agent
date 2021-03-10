# DCSS Sentiment Analysis

This repository contains an example websocket service that implements the interactions described in [DCSS Remote AI Service Integration ](https://github.com/mit-teaching-systems-lab/dcss-remote-ai-integration). This demonstration also illustrates the use of a child process.


## Directory


### `index.html`

An example web client that connects and requests analysis from the service.

### `remote-process.js`

An example server client that connects and requests analysis from the service.

### `sentiment.js`

An example binary that the server shells out to for analysis. 

### `server.js`

The core socket service. This coordinates input analysis with child processes, and responds to remote requests.

