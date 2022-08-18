#!/usr/bin/env node
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const pathPythonFile = require('path').resolve(
  __dirname,
  'check-git-repositories.py'
)

;(async () => {
  const runPythonFile = async () => {
    const { stdout, stderr } = await exec(`python3 ${pathPythonFile}`)
    if (stdout) console.log(stdout)
    if (stderr) console.log(stderr)
  }

  await runPythonFile()
})()
