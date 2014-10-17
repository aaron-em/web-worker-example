var interval
  , id
  , percent = 0;

/**
 * Event handler which fires when the parent thread sends us a
 * message.
 * "onmessage" and "postMessage" are defined in a web worker's global
 * scope.
 */
onmessage = function(evt) {
  if (evt.data.state === 'ready') {
    // the parent thread told us to start work, and what our ID is so
    // we can capture it
    id = evt.data.id;
    postMessage({id: id, message: 'startup'});
    doWork();
  } else {
    postMessage({id: id, message: 'unknown message ' + evt.data});
  }
};

/**
 * Do some work. For this example, all we do is update a percentage
 * and pass it back every 1/5 of a second.
 */
function doWork() {
  interval = setInterval(updateStatus, 200);
};

/**
 * Update the notional completion percentage, and notify the parent
 * thread of our current state. If we've hit 100%, clean up and tear
 * down the thread.
 */
function updateStatus() {
  percent += 10;
  postMessage({id: id, message: percent + '% completion'});
  if (percent >= 100) {
    // we're done, so...
    finishWork();
  }
};

/**
 * Clean up and tear down this worker thread.
 */
function finishWork() {
  // get rid of the interval we started
  clearInterval(interval);
  // notify the parent thread that we're finished
  postMessage({id: id, message: 'shutdown'});
  // tell the browser it's OK to destroy this thread, so we don't leak
  // resources
  self.close();
};