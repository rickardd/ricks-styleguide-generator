const chalk = require('chalk')
const figlet = require('figlet')
const fs = require('fs')
const util = require('util')

const questions = [
  { phrase: "Title? ", configName: "title"},
  { phrase: "src directory? ", configName: "src"},
  { phrase: "dist directory? ", configName: "dist"},
  { phrase: "config path (ink. name.json) ", configName: "configPath"},
]

let questionIndex = 0

const config = {}

function ask(questions, index) {
  process.stdout.write(questions[index].phrase)
}

function quesion(index) {

}

function printConfigs(questions) {
  console.log(chalk.yellow('Following settings can be changed at any time in ') + chalk.red(config.configPath))
  Object.entries(config).forEach( (a) => {
    process.stdout.write(`${a[0]} : ${a[1]} \n`)
  })
}

function handleQA(){
  ask( questions, questionIndex)
}

function saveConfig( str ) {
  config[ questions[ questionIndex ].configName ] = str.trim()
}

function saveToFile() {
  const path = `${process.cwd()}/${config.configPath}`;
  if (!fs.existsSync(path)) {
      console.log('Createing new folder', path)
      fs.mkdirSync(`${path}`, 0744); // with read and write permission
  }
  fs.writeFileSync(`${path}/rsg-config.json`, JSON.stringify(config, null, 2) , 'utf-8');
}

process.stdin.on('data', (data) => {
  saveConfig( data.toString() )
  if ( questionIndex >= questions.length - 1) {
    printConfigs()
    saveToFile()
    process.exit()
  }
  else{
    questionIndex += 1
    handleQA()

  }
})

figlet('Ricks Style Guide!', function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(chalk.yellow(data));
    handleQA()
});
