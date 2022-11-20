const router = require("express").Router();

//our song model
const song = require("../models/song");
const user = require("../models/user");
//add fauvorites 
router.post("/fauvorites/:id",  async (req, res) => {
    console.log(req.body)
    console.log(req.params)
    const player = await user.findById(req.body._id)
    console.log('player',player)
    const newMusic = player.songs
    const checkMusic = newMusic.includes(req.params.id)
    if(checkMusic == false){
        newMusic.push(req.params.id)
    }
    console.log(newMusic)
    player.update({
        songs : newMusic
    })  
    player.populate("songs")
    if (player) {
        await player.save();
        return res.status(200).send({ success: true, user: player })
    } else {
        return res.status(400).send({ success: false, msg: "Data not found" });
    }
});
router.get("/user/:id",  async(req, res)=>{
    let player = await user.findById(req.params.id).populate("songs").populate("playlist")
    if (player) {
        return res.status(200).send({ success: true, user: player })
    } else {
        return res.status(400).send({ success: false, msg: "Data not found" });
    }
});
router.post("/fauvoritesdetele/:id",  async (req, res) => {
    console.log(req.body)
    console.log(req.params)
    const player = await user.findById(req.body._id)
    console.log('player.songs',player.songs)
    const allFauvorites = player.songs.filter(item=> item != req.params.id )
    console.log('player',player)
    console.log('allfauvorites', allFauvorites)
    await player.update({
        songs : allFauvorites
    })  
    // player.populate("songs")
    if (player) {
        await player.save();
        console.log('player',player)
        return res.status(200).send({ success: true, user: player })
    } else {
        return res.status(400).send({ success: false, msg: "Data not found" });
    }
});
//Add song mới
router.post("/save", async (req, res) => {
    const newSong = song({
        name: req.body.name,
        imageURL: req.body.imageURL,
        songURL: req.body.songURL,
        album: req.body.album,
        artist: req.body.artist,
        language: req.body.language,
        category: req.body.category,
    });

    try {
        const savedSong = await newSong.save();
        return res.status(200).send({ success: true, song: savedSong })
    } catch (error) {
        return res.status(400).send({ success: false, msg: error });
    }
});

//lấy 1 id của song
router.get("/getOne/:id", async (req,res) => {
    const filter = { _id : req.params.id };

    const data = await song.findOne(filter)

    if (data) {
        return res.status(200).send({ success: true, song: data })
    } else {
        return res.status(400).send({ success: false, msg: "Data not found" });
    }
});

//lấy tất cả song kiểu như lấy danh sách
router.get("/getAll", async (req, res) => {
    const options = {
        sort: {
            createdAt : 1,
        }
    }

    const data = await song.find(options);
    if (data) {
        return res.status(200).send({ success: true, songs: data })
    } else {
        return res.status(400).send({ success: false, msg: "Data not found" });
    }
})

//update song
router.put("/update/:id", async (req, res) => {

    const filter = {_id : req.params.id};

    const options = {
        upsert : true,
        new : true
    };

    try {
        const result = await song.findOneAndUpdate(
            filter, 
            {
                name: req.body.name,
                imageURL: req.body.imageURL,
                songURL: req.body.songURL,
                album: req.body.album,
                artist: req.body.artist,
                language: req.body.language,
                category: req.body.category,
            },
            options
        );
        return res.status(200).send({success : true, data : result})
    } catch (error) {
        return res.status(400).send({ success : false, msg : error})
    }
})

//delete song
router.delete("/delete/:id", async (req, res) => {
    const filter = { _id: req.params.id }

    const result = await song.deleteOne(filter);
    if (result) {
        return res.status(200).send({ success: true, msg: "Data Deleted successfully", data: result })
    } else {
        return res.status(400).send({ success: false, msg: "Data not found" });
    }
});
router.post("/playlist/:id",  async (req, res) => {
    console.log(req.body)
    console.log(req.params)
    const player = await user.findById(req.body._id)
    console.log('player',player)
    const newMusic = player.playlist
    const checkMusic = newMusic.includes(req.params.id)
    if(checkMusic == false){
        newMusic.push(req.params.id)
    }
    console.log(newMusic)
    player.update({
        playlist : newMusic
    })  
    player.populate("songs")
    if (player) {
        await player.save();
        return res.status(200).send({ success: true, user: player })
    } else {
        return res.status(400).send({ success: false, msg: "Data not found" });
    }
});

router.post("/playlistdetele/:id",  async (req, res) => {
    console.log(req.body)
    console.log(req.params)
    const player = await user.findById(req.body._id)
    console.log('player.playlist',player.playlist)
    const allPlaylist = player.playlist.filter(item=> item != req.params.id )
    console.log('allPlaylist', allPlaylist)
    await player.update({
        playlist : allPlaylist
    })  
    // player.populate("songs")
    if (player) {
        await player.save();
        console.log('player',player)
        return res.status(200).send({ success: true, user: player })
    } else {
        return res.status(400).send({ success: false, msg: "Data not found" });
    }
});


module.exports = router;