const express = require('express');
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.set('view engine', 'ejs');
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.render("room");
});

const arrUserInfo = [];
io.on('connection', socket => {
    socket.on('NGUOI_DUNG_DANG_KY', user => {
        const isExist = arrUserInfo.some(e => e.ten === user.ten)
        if(isExist){
            return socket.emit('DANG_KY_THAT_BAI');
        }
        //console.log(username);
        arrUserInfo.push(user);
        socket.emit('DANH_SACH_ONLINE', arrUserInfo);
        socket.broadcast.emit('CO_NGUOI_DUNG_MOI', user);
    })
})


const port = process.env.PORT || 5000
server.listen(port, () => console.log('Server is running at: http://localhost:' + 5000))