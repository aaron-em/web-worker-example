var workerId = 0
  , logDiv;

window.Workers = [];

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
  , id = ++workerId
  , feeding = false
  , buf = null
  , fub = null
  , expect = 0;

  // The worker waits for this message before it starts doing things
  worker.postMessage({'state': 'ready', 'id': id});

  // This listener fires when the worker sends us a message
  worker.addEventListener('message', log);

  worker.addEventListener('message', function(evt) {
    if (feeding) {
      var start = 25000 * (evt.data.percent - 1);
      var end = 25000 * evt.data.percent;
      for (var i = start; i < end; i++) {
        fub[i] = evt.data.content[i];
      };
    };

    if (!feeding && evt.data.message.match(/feed size: (\d+)/)) {
      expect = parseInt(evt.data.message.split(/\:\s+/)[1]);
    };
    
    if (!feeding && evt.data.message === 'feeding content') {
      feeding = true;
      buf = new ArrayBuffer(250 * 1000 * 1000);
      fub = new Uint8Array(buf);
    };
  });
  
  worker.addEventListener('message', function(evt, parent) {
    if (evt.data.message === 'shutdown') {
      window.Workers.splice(window.Workers.indexOf(worker), 1);
      log({data: {id: id, message: 'ended up eating ' + fub.length}}, true);
      log({data: {id: id,
                  message: (fub.length === expect
                            ? 'got'
                            : 'did not get')
                  + ' what was expected'}}, true);
    };
  });

  log({data:{id:id,message:'starting worker ' + id}}, true);

  window.Workers.push(worker);
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
