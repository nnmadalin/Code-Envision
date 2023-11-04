#include "DHT.h"
#include "WiFi.h"
#include "ArduinoJson.h"
#include "HTTPClient.h"
#include "Preferences.h"
#include "Crypto.h"
#include "AESLib.h"



#define DHTPIN 19
#define DHTTYPE DHT11
#define MQPIN 34
#define  POLpin1 23
#define  POLpin2 22

byte key[16] = {'h', 'q', 'z', '2', 'q', 'b', '3', '1', '8', '1', 'y', 'q', 'b', 'x', 'i', 'r'};

DHT dht(DHTPIN, DHTTYPE);

AESLib aes;


unsigned long duration1;
unsigned long duration2;
unsigned long starttime;
unsigned long sampletime_ms = 1000;
unsigned long lowpulseoccupancy1 = 0;
unsigned long lowpulseoccupancy2 = 0;
float ratio1 = 0;
float ratio2 = 0;
float concentration1 = 0;
float concentration2 = 0;

String output;

Preferences preferences;

DynamicJsonDocument data(2048);

const char* ssid = "iPhone - Madalin";
const char* password = "Madalin123";

void setup() {
  dht.begin();
  Serial.begin(9600); 

  pinMode(MQPIN, OUTPUT); 
  pinMode(18,INPUT);
  pinMode(5,INPUT);

  preferences.begin("credentials", false);
  //preferences.putString("token", "aZaV6wLfhEN4AdZXAlZ8PZMhw1rbHRn2C2OdkuA785RfrM02bKkUt95Bu1oB0YZX2M4n4atBfofdVxpWOVuqwLJqmmsOpzAdWVdUD2PuYyL4EboOGNnyedLOeZjIrHzr7Bt6qkEKJ0WvXuUDoJNTU0W2IGaByLcVg5h8hM0b8T5kdI9VOCspsF5ApmIIg8x5Ray71HwTNXy4rEZJoNFuteX5iwkcnXZQUlrM1PkDjQQWMlGKVeTw6YCGAfygEgj3"); 

  starttime = millis();

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
  Serial.println(WiFi.localIP());

  Serial.println("");Serial.println("");  

  //pol();
}


void loop() {
  duration1 = pulseIn(POLpin1, LOW);
  duration2 = pulseIn(POLpin2, LOW);
  lowpulseoccupancy1 = lowpulseoccupancy1+duration1;
  lowpulseoccupancy2 = lowpulseoccupancy2+duration2;

  if ((millis()-starttime) > sampletime_ms)
  {
    DynamicJsonDocument data(2048);
    data["token"] = preferences.getString("token", "");
    data["mac"] = String(WiFi.macAddress());
    
    float humi = dht.readHumidity();
    float tempC = dht.readTemperature();
    int MQvalue = analogRead(MQPIN);

    data["humidity"] = String(humi);
    data["temperature"] = String(tempC);
    data["mqvalue"] = String(MQvalue);

    Serial.println("Umiditate: " + String(humi) + "   -   Temperatura: "  + String(tempC) + "   -   MQ value: "  + String(MQvalue));


    ratio1 = lowpulseoccupancy1/(sampletime_ms*10.0);  
    concentration1 = 1.1*pow(ratio1,3)-3.8*pow(ratio1,2)+520*ratio1+0.62; 
    ratio2 = lowpulseoccupancy2/(sampletime_ms*10.0); 
    concentration2 = 1.1*pow(ratio2,3)-3.8*pow(ratio2,2)+520*ratio2+0.62; 
    Serial.println("PM2.5: " + String(concentration1) + "   -   PM1.0: "  + String(concentration2));

    lowpulseoccupancy1 = 0;
    lowpulseoccupancy2 = 0;
    starttime = millis();

    output = "";
    data["pm25"] = String(concentration1);
    data["pm1"] = String(concentration2);

    if(WiFi.status()== WL_CONNECTED){
      HTTPClient http;   


      serializeJson(data, output);
      Serial.println("");
      Serial.println(output);
      Serial.println("");

      http.begin("http://172.20.10.4:3003/values");  
      http.addHeader("Content-Type", "application/json; charset=utf-8");        
      
      int httpResponseCode = http.POST(output);  
      
      if(httpResponseCode>0 && httpResponseCode == 201){
      
        String response = http.getString();                     

        while(response.isEmpty()) {
          delay(1000); 
          response = http.getString();
        }
        while(data["token"] != response){
          data["token"] = response;
          preferences.putString("token", response);
        }
        
        Serial.println("");
        Serial.println(httpResponseCode);
        Serial.println(response);
        
      }else{
      
        Serial.print("Error on sending POST: ");
        Serial.println(httpResponseCode);
      
      }
      
      http.end();
    }

    
  }

}
