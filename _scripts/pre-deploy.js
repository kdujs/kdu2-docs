// udpate to latest built files of Kdu
const fs = require('fs')
const zlib = require('zlib')
const axios = require('axios')
const execSync = require('child_process').execSync

const themeconfPath = 'themes/kdu/_config.yml'
const installPath = 'src/v2/guide/installation.md'
const themeconfig = fs.readFileSync(themeconfPath, 'utf-8')
const installation = fs.readFileSync(installPath, 'utf-8')

// get latest Kdu version
console.log(`Checking latest Kdu version...`)
const localVersion = themeconfig.match(/kdu_version: (.*)/)[1]
const version = execSync('npm view kdu@v2-latest version').toString().trim()

if (localVersion === version) {
  console.log(`Version is up-to-date.`)
  process.exit(0)
}

console.log(`Latest version: ${version}. Downloading dist files...`)

// replace version in theme config
fs.writeFileSync(
  themeconfPath,
  themeconfig.replace(/kdu_version: .*/, 'kdu_version: ' + version)
)

// grab it from unpkg
Promise.all([download(`kdu.js`), download(`kdu.min.js`)])
  .then(([devSize, prodSize]) => {
    // replace installation page version and size
    fs.writeFileSync(
      installPath,
      installation
        .replace(/kdu_version: .*/, 'kdu_version: ' + version)
        .replace(/gz_size:.*/g, `gz_size: "${prodSize}"`)
        .replace(/\/kdu@[\d\.]+/g, `/kdu@${version}`)
    )
    console.log(
      `\nSuccessfully updated Kdu version (${version}) and gzip file size (${prodSize}kb).\n`
    )
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })

function download(file) {
  return axios({
    url: `http://unpkg.com/kdu@${version}/dist/${file}`,
    method: 'get'
  }).then((res) => {
    fs.writeFileSync(`themes/kdu/source/js/${file}`, res.data)
    const zipped = zlib.gzipSync(Buffer.from(res.data))
    return (zipped.length / 1024).toFixed(2)
  })
}
