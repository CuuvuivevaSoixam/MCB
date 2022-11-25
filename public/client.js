const socket = io();

//-----doi?mau\-------
function changeColor1(x) {
    if (x<20) {
        document.getElementById("temp").style.background = 'pink'
    }else if(x>20 && x<50){
        document.getElementById("temp").style.background='red'
    }else{
        document.getElementById("temp").style.background='orange'
    }
}
function changeColor2 (y) {
    if (y<50) {
        document.getElementById("hum").style.background = "brown"
    }else if(y>50 && y<80){
        document.getElementById("hum").style.background='green'
    }else{
        document.getElementById("hum").style.background='blue'
    }
}
function changeColor3 (z) {
    if (z<100) {
        document.getElementById("light").style.background = "black"
    }else if(z>100 && z<500){
        document.getElementById("light").style.background='yellow'
    }else{
        document.getElementById("light").style.background='pink'
    }
}


//------bieu?do\----

const ctx = document.getElementById('myChart').getContext('2d');
const data = {
    labels: [],
    datasets: [
        {
            type: 'line',
            label: 'Temp',
            data: [],
            backgroundColor: '#FF9F9F',
            borderColor: '#FF9F9F',
        },
        {
            type: 'line',
            label: 'Hum',
            data: [],
            backgroundColor: '#8D9EFF',
            borderColor: '#8D9EFF',
        },
        {
            type: 'line',
            label: 'Light',
            data: [],
            backgroundColor: '#FCDDB0',
            borderColor: '#FCDDB0',
        },
    ],
};

const config = {
    type: 'line',
    data: data,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Data Sensor Update',
            },
        },
    },
};

function auto(x){
    if(x>900){
    socket.emit('led1','on')
    document.querySelector('#anh1').src='light-on.png'
    }
    else{
        socket.emit('led1','off')
        document.querySelector('#anh1').src='light-off.png'
    }
}


Chart.defaults.color = '#000';
const sensorsChart = new Chart(ctx, config);
const handlingData = arr => {
const dataSS = arr.map(data => Number(data));

    data.datasets[0].data.push(dataSS[0]);
    data.datasets[0].data.length === 13 && data.datasets[0].data.shift();
    data.datasets[1].data.push(dataSS[1]);
    data.datasets[1].data.length === 13 && data.datasets[1].data.shift();
    data.datasets[2].data.push(dataSS[2]);
    data.datasets[2].data.length === 13 && data.datasets[2].data.shift();
    document.getElementById("col1").innerHTML = dataSS[0]
    document.getElementById("col2").innerHTML = dataSS[1]
    document.getElementById("col3").innerHTML = dataSS[2]
    changeColor1(dataSS[0])
    changeColor2(dataSS[1])
    changeColor3(dataSS[2])
    auto(dataSS[2])

const day = new Date();
let time = `${day.getHours()}:${day.getMinutes()}:${day.getSeconds()}`;

    data.labels.push(time);
    data.labels.length === 13 && data.labels.shift();
    sensorsChart.update()
};

// -------Deviece control----
let thongbaobat='bạn có muốn bật đèn không'
let thongbaotat='bạn có muốn tắt đèn không'
document.querySelector('#but1').addEventListener('click',()=> {
    if (confirm(thongbaobat)){
        socket.emit('led1', 'on')
        document.getElementById("but1").style.background="blue"
        document.getElementById("but2").style.background="gray"
        document.querySelector('#anh1').src='light-on.png'
    }
})
document.querySelector('#but2').addEventListener('click',()=> {
    if (confirm(thongbaotat)){
        socket.emit('led1', 'off')
        document.getElementById("but2").style.background="blue"
        document.getElementById("but1").style.background="gray"
        document.querySelector('#anh1').src='light-off.png'
    }
})
document.querySelector('input').onclick = function(e){
    if (this.checked){
        if (confirm(thongbaobat)){
            socket.emit('led2', 'on')
            document.querySelector('#anh2').src='light-on.png'
            document.querySelector('input').checked= true
        }
        else{
            document.querySelector('input').checked= false
            document.querySelector('#anh2').src='light-off.png'
        }
    }
    else{
        if (confirm(thongbaotat)){
            socket.emit('led2', 'off')
            document.querySelector('#anh2').src='light-off.png'
            document.querySelector('input').checked= false
        }
        else{
            document.querySelector('input').checked= true
            document.querySelector('#anh2').src='light-on.png'
        }
    }
}

//------Socket IO ----


socket.on('updateSensor', msg => {     //lang nghe du lieu tu mqtt
    console.log(msg);
    handlingData(msg);
});

socket.on('led1', msg => {
    if (msg === 'on') {
        document.querySelector('#anh1').src = 'light-on.png';
    }
    if (msg === 'off') {
        document.querySelector('#anh1').src = 'light-off.png';
    }
    console.log(`light 1 ${msg}`);
});

socket.on('led2', msg => {
    if (msg === 'on') {
        document.querySelector('#anh2').src = 'light-on.png';
    }
    if (msg === 'off') {
        document.querySelector('#anh2').src = 'light-off.png';
    }
    console.log(`light 2 ${msg}`);
});