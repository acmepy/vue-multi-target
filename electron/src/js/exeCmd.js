import { exec } from 'child_process'

export default async (cmd) => {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      console.log(`Ejecutando: ${cmd}`)
      if (error) {
        console.error(`Error: ${error.message}`)
        reject(error)
      } else if (stderr) {
        console.error(`stderr: ${stderr}`)
        reject(stderr)
      } else {
        console.log(`stdout: ${stdout}`)
        resolve(stdout)
      }
    })
  })
}
