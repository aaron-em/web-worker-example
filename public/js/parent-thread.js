var workerId = 0
  , logDiv;

/**
 * Set up the button with a click listener which will spawn a new
 * worker.
 */
window.addEventListener('load', function() {
  var button = document.querySelector('button');
  logDiv = document.querySelector('div');

  button.addEventListener('click', startWorker);
  button.disabled = false;
});

/**
 * Spin up a new web worker and kick off its work process.
 */
function startWorker() {
  var worker = new Worker('js/worker-thread.js')
    , id = ++workerId;

  // The worker waits for this message before it starts doing things
  worker.postMessage({'state': 'ready', 'id': id});

  // This listener fires when the worker sends us a message
  worker.addEventListener('message', log);

  log({data:{id:id,message:'starting worker ' + id}}, true);
};

/**
 * Add a log entry with a message received from a worker. Triggered by
 * the 'message' event on the worker object.
 */
function log(evt, parent) {
  var message = (parent ? 'Parent' : 'Worker ' + evt.data.id)
              + ' reports ' + evt.data.message
    , entry = document.createElement('p');

  entry.setAttribute('class', evt.data.message);
  entry.innerHTML = (parent ? '→' : '←') + ' ' + message;

  logDiv.appendChild(entry);
  logDiv.scrollTop = Math.pow(2, 16);
};
