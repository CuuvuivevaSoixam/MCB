const mqtt = require("mqtt");

const options = {
    clientID: "dai",
    username: "dai",
    password: "123456",
    host: "mqtt.wuys.me",
    port: 1883,
};

const client = mqtt.connect(options);

const dataRandom = () => {
    let temp = Math.trunc(Math.random() * 40) + 1;
    let hum = Math.trunc(Math.random() * 100) + 1;
    let light = Math.trunc(Math.random() * 1000) + 1;
    return {
        temp,
        hum,
        light,
    };
};
let message;

client.on("connect", () => {
    // console.log(`connected: ${client.connected}`);
    // client.subscribe('dataSensors', () => {});
    setInterval(() => {
        message = `${JSON.stringify(dataRandom())}`;
        client.publish("dataSensors", message, () => {
            console.log(JSON.parse(message));
        });
    }, 2000);
});

client.on("error", error => {
    console.log(`Can't connect ${error}`);
});

// Publish
// client.publish(topic, message, [options], [callback])
