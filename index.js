const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const multer = require('multer')
const path = require('path')
const imagesize = require('image-size')
const gm = require('gm')

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))

app.set('view engine', 'ejs')

app.use(express.static(__dirname))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage
})

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/', upload.single('image'), (req, res, next) => {
    if (!req.file) {
        res.send("Please Upload an image")
    }
    else {
        const dimensions = imagesize(req.file.path)
        res.render('image.ejs', { url: req.file.path, name: req.file.filename, width: dimensions.width, height: dimensions.height })
        // res.send("Image Uploaded")
    }
})

app.post('/resize/uploads/:path', (req, res) => {
    var image = req.params.path
    var width = req.body.width
    var height = req.body.height
    gm('uploads/' + image)
        // .resize(width, height)
        .fill("#ffffff")
        .font("Phenomena-Bold.otf", 27)
        // .region(50,50,50,50).drawText(0, 0, 'Arulyan', 'center');
        .write('./modified/output.png', (err) => {
            if (err) {
                res.send(err)
            }
            res.download("./modified/output.png")
        })
})

app.listen(5000, () => {
    console.log("Server is listening on port 5000")
})