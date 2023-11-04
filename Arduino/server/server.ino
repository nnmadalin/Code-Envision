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
unsigned long sampletime_ms = 3000;
unsigned long lowpulseoccupancy1 = 0;
unsigned long lowpulseoccupancy2 = 0;
float ratio1 = 0;
float ratio2 = 0;
float concentration1 = 0;
float concentration2 = 0;

DynamicJsonDocument data(1024);
DynamicJsonDocument tokenJson(1024);
String output;

Preferences preferences;


const char* ssid = "iPhone - Madalin";
const char* password = "Madalin123";
String token_now = "";

void setup() {
  dht.begin();
  Serial.begin(9600); 

  pinMode(MQPIN, OUTPUT); 
  pinMode(18,INPUT);
  pinMode(5,INPUT);

  preferences.begin("credentials", false);
  preferences.putString("token", "aZaV6wLfhEN4AdZXAlZ8PZMhw1rbHRn2C2OdkuA785RfrM02bKkUt95Bu1oB0YZX2M4n4atBfofdVxpWOVuqwLJqmmsOpzAdWVdUD2PuYyL4EboOGNnyedLOeZjIrHzr7Bt6qkEKJ0WvXuUDoJNTU0W2IGaByLcVg5h8hM0b8T5kdI9VOCspsF5ApmIIg8x5Ray71HwTNXy4rEZJoNFuteX5iwkcnXZQUlrM1PkDjQQWMlGKVeTw6YCGAfygEgj3"); 
  
  token_now = preferences.getString("token", "");
  token_now = "aZaV6wLfhEN4AdZXAlZ8PZMhw1rbHRn2C2OdkuA785RfrM02bKkUt95Bu1oB0YZX2M4n4atBfofdVxpWOVuqwLJqmmsOpzAdWVdUD2PuYyL4EboOGNnyedLOeZjIrHzr7Bt6qkEKJ0WvXuUDoJNTU0W2IGaByLcVg5h8hM0b8T5kdI9VOCspsF5ApmIIg8x5Ray71HwTNXy4rEZJoNFuteX5iwkcnXZQUlrM1PkDjQQWMlGKVeTw6YCGAfygEgj3";
  
  starttime = millis();
  Serial.println(token_now);

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

  pol();
}

void get_hum_temp_MQ(){
    float humi = dht.readHumidity();
    float tempC = dht.readTemperature();
    int MQvalue = analogRead(MQPIN);

    data["humidity"] = humi;
    data["temperature"] = tempC;
    data["MQvalue"] = MQvalue;

    Serial.println("Umiditate: " + String(humi) + "   -   Temperatura: "  + String(tempC) + "   -   MQ value: "  + String(MQvalue));
}

void pol(){
  duration1 = pulseIn(POLpin1, LOW);
  duration2 = pulseIn(POLpin2, LOW);
  lowpulseoccupancy1 = lowpulseoccupancy1+duration1;
  lowpulseoccupancy2 = lowpulseoccupancy2+duration2;

  if ((millis()-starttime) > sampletime_ms)
  {
    get_hum_temp_MQ();

    ratio1 = lowpulseoccupancy1/(sampletime_ms*10.0);  
    concentration1 = 1.1*pow(ratio1,3)-3.8*pow(ratio1,2)+520*ratio1+0.62; 
    ratio2 = lowpulseoccupancy2/(sampletime_ms*10.0); 
    concentration2 = 1.1*pow(ratio2,3)-3.8*pow(ratio2,2)+520*ratio2+0.62; 
    Serial.println("PM2.5: " + String(concentration1) + "   -   PM1.0: "  + String(concentration2));

    lowpulseoccupancy1 = 0;
    lowpulseoccupancy2 = 0;
    starttime = millis();

    output = "";
    data["PM2.5"] = concentration1;
    data["PM1.0"] = concentration2;

    if(WiFi.status()== WL_CONNECTED){
      HTTPClient http;   

      data["mac"] = WiFi.macAddress();
      data["token"] = token_now;


      serializeJson(data, output);

      http.begin("http://172.20.10.4:3003/values");  
      http.addHeader("Content-Type", "application/json; charset=utf-8");        
      
      //Serial.print(output);
      int httpResponseCode = http.POST(output);  
      
      if(httpResponseCode>0){
      
        String response = http.getString();                     

        Serial.println(httpResponseCode);
        Serial.println(response);

        token_now = response;
        preferences.putString("token", token_now);
      }else{
      
        Serial.print("Error on sending POST: ");
        Serial.println(httpResponseCode);
      
      }
      
      http.end();
    }

    
  }
}

void loop() {
  pol();  

}
