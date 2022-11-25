#include <ESP8266WiFi.h>
#include <String.h>
#include <PubSubClient.h>
#include "DHT.h"

#define DHTPIN 4 
#define DHTTYPE DHT11
#define LDR 34
#define pinOutLed1 18 // D1
#define pinOutLed2 19 // D2
#define wifi_ssid "LAD"
#define wifi_password "12345679"
#define mqtt_server "broker.mqttdashboard.com"
#define mqtt_user " lad"
#define mqtt_password "123456"
#define topic "sensorlad"
DHT dht(DHTPIN, DHTTYPE);

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  pinMode(pinOutLed1, OUTPUT);
  pinMode(pinOutLed2, OUTPUT);
  Serial.begin(115200);
  dht.begin();
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(wifi_ssid);
  WiFi.begin(wifi_ssid, wifi_password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientName = "clientId-gAe5UTm3Ou";
    if (client.connect(clientName.c_str(), mqtt_user, mqtt_password)) {
      Serial.println("connected");
      client.subscribe("LED11");
      client.subscribe("LED21");
    } else {
      Serial.println("failed, try again in 5 seconds");
      delay(5000);
    }
  }
}

void callback(String topic_sub, byte *payload, unsigned int length) {
    Serial.print("Message arrived in topic: ");
    Serial.println(topic_sub);
    Serial.print("Message:");
    String message = "";
    for (int i = 0; i < length; i++) {
        message = message + (char) payload[i];  // convert *byte to string
    }
  Serial.print(message);
  Serial.println();
  if(topic_sub == "LED11"){
    if(message == "on"){
      digitalWrite(pinOutLed1, HIGH);
      Serial.print("on");
    }
    if(message == "off"){
      digitalWrite(pinOutLed1, LOW);
       Serial.print("Off");
    }
  }
  if(topic_sub == "LED21"){
    if(message == "on"){
      digitalWrite(pinOutLed2, HIGH);
      Serial.print("on");
    }
    if(message == "off"){
      digitalWrite(pinOutLed2, LOW);
      Serial.print("off");
    }
  }
}


void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  delay(2000);
  float hum = dht.readHumidity();
  float temp = dht.readTemperature();    
  float lux = analogRead(LDR);    
  if (isnan(hum) || isnan(temp) || isnan(lux)) {
    Serial.println("Failed to read from sensor!");
    return;
  }
  String msg = String(temp) + " " + String(hum) + " " + String(lux);   
  client.publish(topic, msg.c_str(), true);
  Serial.printf("Publishing on topic %s \n", topic);
  Serial.printf("Message: %.2f %.2f %.2f\n", temp, hum, lux);
}
