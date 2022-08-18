#!/usr/bin/env node
const util = require('util')
const exec = util.promisify(require('child_process').exec)

;(async () => {
  const runPythonFile = async () => {
    const { stdout, stderr } = await exec('python3 ./check-git-repositories.py')
    if (stdout) console.log(stdout)
    if (stderr) console.log(stderr)
  }

  await runPythonFile()
})()
