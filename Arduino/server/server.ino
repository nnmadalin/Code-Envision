#include "DHT.h"
#include "WiFi.h"
#include "ArduinoJson.h"
#include "ESPAsyncWebSrv.h"


#define DHTPIN 19
#define DHTTYPE DHT11
#define MQPIN 34
#define  POLpin1 23
#define  POLpin2 22

DHT dht(DHTPIN, DHTTYPE);

unsigned long duration1;
unsigned long duration2;
unsigned long starttime;
unsigned long sampletime_ms = 3000;
unsigned long lowpulseoccupancy1 = 0;
unsigned long lowpulseoccupancy2 = 0;
float ratio1 = 0;
float ratio2 = 0;
float concentration1 = 0;
float concentration2 = 0;

DynamicJsonDocument data(1024);
String output;

AsyncWebServer server(80);


const char* ssid = "iPhone - Madalin";
const char* password = "Madalin123";

void setup() {
  dht.begin();
  Serial.begin(9600); 

  pinMode(MQPIN, OUTPUT); 
  pinMode(18,INPUT);
  pinMode(5,INPUT);
  starttime = millis(); 

  delay(1000);

  int n = WiFi.scanNetworks();
  Serial.println("scan done");
  if (n == 0) {
      Serial.println("no networks found");
  } else {
    Serial.print(n);
    Serial.println(" networks found");
    for (int i = 0; i < n; ++i) {
      // Print SSID and RSSI for each network found
      Serial.print(i + 1);
      Serial.print(": ");
      Serial.print(WiFi.SSID(i));
      Serial.print(" (");
      Serial.print(WiFi.RSSI(i));
      Serial.print(")");
      Serial.println((WiFi.encryptionType(i) == WIFI_AUTH_OPEN)?" ":"*");
      delay(10);
    }
  }
  starttime = millis();
  Serial.println("");

  WiFi.begin(ssid, password);
  Serial.println("Conectare");

  while(WiFi.status() != WL_CONNECTED){
    Serial.println(" - asteapta");
    delay(100);
  } 

  Serial.println("");
  Serial.println("");

  Serial.println("Conectat la internet!");
  Serial.print("IP ESP: ");
  
  IPAddress local_IP(172, 20, 10, 2);
  IPAddress gateway(172, 20, 10, 1);
  IPAddress subnet(255, 255, 255, 240);
  WiFi.config(local_IP, gateway, subnet);
  Serial.println(WiFi.localIP());



  Serial.println("");Serial.println("");

 
  serializeJson(data, output);

  server.on("/", HTTP_GET, [output](AsyncWebServerRequest *request){
    request->send_P(200, "text/json",output.c_str());
  });
  server.begin();

}
void loop() {
  duration1 = pulseIn(POLpin1, LOW);
  duration2 = pulseIn(POLpin2, LOW);
  lowpulseoccupancy1 = lowpulseoccupancy1+duration1;
  lowpulseoccupancy2 = lowpulseoccupancy2+duration2;

  if ((millis()-starttime) > sampletime_ms)
  {
    float humi = dht.readHumidity();
    float tempC = dht.readTemperature();
    int MQvalue = analogRead(MQPIN);

    data["humidity"] = humi;
    data["temperature"] = tempC;
    data["MQvalue"] = MQvalue;

    Serial.println("Umiditate: " + String(humi) + "   -   Temperatura: "  + String(tempC) + "   -   MQ value: "  + String(MQvalue));

    ratio1 = lowpulseoccupancy1/(sampletime_ms*10.0);  
    concentration1 = 1.1*pow(ratio1,3)-3.8*pow(ratio1,2)+520*ratio1+0.62; 
    ratio2 = lowpulseoccupancy2/(sampletime_ms*10.0); 
    concentration2 = 1.1*pow(ratio2,3)-3.8*pow(ratio2,2)+520*ratio2+0.62; 


    Serial.println("concentration1: " + String(concentration1) + "   -   concentration2: "  + String(concentration2));

    lowpulseoccupancy1 = 0;
    lowpulseoccupancy2 = 0;
    starttime = millis();

    output = "";
    data["PM2.5"] = concentration1;
    data["PM1.0"] = concentration2;
    serializeJson(data, output);
  }

}
