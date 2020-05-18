#!/usr/bin/env node

import Reporter from '@start/reporter-verbose'
import * as tasks from './'

const taskName = process.argv[2]
const task = tasks[taskName]

if (typeof taskName === 'undefined' || typeof task === 'undefined') {
  const commands = Object.keys(tasks).join('\n* ')
  const message = `One of the following commands is available:\n* ${commands}`
  throw new TypeError(message)
}

void (async () => {
  try {
    const reporter = Reporter(taskName)
    const taskArgs = process.argv.slice(3)
    const taskRunner = await task(...taskArgs)

    await taskRunner(reporter)()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
})()
