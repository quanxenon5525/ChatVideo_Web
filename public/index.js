const peer = new Peer();
let myStream;
let peerList = [];

$('#outsideRoom').hide();
$('#afterJoin').hide();

socket.on('DANH_SACH_ONLINE', arrUserInfo => {
    $('#outsideRoom').show();
    $('#afterJoin').show();
    $('#addName').hide();
    arrUserInfo.forEach(user => {
        const { ten, peerId } = user;
        $('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
    })

    socket.on('DCO_NGUOI_DUNG_MOI', user => {
        const { ten, peerId } = user;
        $('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
    });

    socket.on('DA_CO_DISCONNECTED', peerId => {
        $(`#${peerId}`).remove();
    })
});

socket.on('DANG_KY_THAT_BAI', () => alert('Vui lòng nhập tên hợp lệ ( hoặc tên đã tồn tại )'));


peer.on('open', id => {
    $("#showPeerID").append(id);
    document.getElementById('submitName').addEventListener('click', () => {
        const username = document.getElementById('getName').value;
        socket.emit('NGUOI_DUNG_DANG_KY', {ten: username, peerId: id}); 
    })
});

peer.on('call', call => {
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
    }).then((stream) => {
        myStream = stream
        addLocalVideo(stream);
        call.answer(stream)
        call.on('stream', remoteStream => {
            if(!peerList.includes(call.peer))
            {
                addRemoteVideo(remoteStream);
                peerList.push(call.peer)
            } 
        })
    }).catch((err) => {
        console.log(err + "unable to get media")
    })
})

//Caller
document.getElementById('joinCall').addEventListener('click', e => {
    let remotePeerId = document.getElementById('getPeerID').value;
    document.getElementById('showPeerID').innerHTML= 'Is connecting to ' + remotePeerId;
    callPeer(remotePeerId);
});

function callPeer(id) {
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
    }).then((stream) => {
        myStream = stream;
        addLocalVideo(stream);
        let call = peer.call(id, stream);
        call.on('stream', remoteStream => {
            if(!peerList.includes(call.peer))
            {
                addRemoteVideo(remoteStream);
                peerList.push(call.peer)
            } 
        })
    }).catch((err) => {
        console.log(err + "unable to get media")
    })
}

function addRemoteVideo(stream) {
    let video = document.createElement('video');
    video.classList.add('video');
    video.srcObject = stream;
    video.play();
    document.getElementById('remoteVideo').append(video)
}

function addLocalVideo(stream) {
    let video = document.createElement('video');
    video.classList.add('video');
    video.srcObject = stream;
    video.play();
    document.getElementById('localVideo').append(video)
}

