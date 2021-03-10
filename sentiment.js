#!/usr/bin/env node

const { Command } = require('commander');
const { SentimentAnalyzer } = require('node-nlp');

const sentimentAnalyzer = new SentimentAnalyzer({ language: 'en' });
const program = new Command();

program
  .option('-d, --debug', 'Print debugging output')
  .option('-i, --input <string>', 'Input string')
  .option('-f, --format <json|key:val>', `Format of output string

    Example:

      sentiment -i 'i love you' -f key:val

      score:0.5;numWords:3;numHits:1;average:0.16666666666666666;type:senticon;locale:en;vote:positive

      sentiment -i 'i love you' -f json

      {"score":0.5,"numWords":3,"numHits":1,"average":0.16666666666666666,"type":"senticon","locale":"en","vote":"positive"}

  `, 'json');

program.parse(process.argv);

const options = program.opts({
  format: 'json'
});

function debug(...args) {
  if (options.debug) {
    console.log('[DEBUG]', ...args);
  }
}

debug('options: ', options);
debug('sentiment analyzer: ', sentimentAnalyzer);

(async () => {
  if (options.input) {
    const result = await sentimentAnalyzer.getSentiment(options.input);
    debug('analysis result: ', result);
    const output = options.format === 'json'
      ? JSON.stringify(result)
      : Object.entries(result).reduce((accum, [key, value]) => `${accum}${key}:${value};`, '').slice(0, -1);

    process.stdout.write(output);
  }
  process.exitCode = 0;
  process.exit();
})();
