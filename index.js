#!/usr/bin/env node
const { spawn } = require('child_process')
const pythonProcess = spawn('python3', ['./check-git-repositories.py'])

pythonProcess.stdout.on('data', data => {
  console.log(data.toString())
})
pythonProcess.stderr.on('data', data => {
  console.log(data.toString())
})
