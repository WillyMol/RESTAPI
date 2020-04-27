/*
This is a general file program for all esp8266-01.
this program work for both, ESP8266-01 (Ardunio ESP8266 Library V.2.5.0) and
NodeMCU Lua ESp8266(Arduino latest ESP8266 library can be use),

 * Select GENERIC ESP8266 MODULE
DEVICE: ESP8266-01 
FROM: EBAY

MAC ADDRESS: 
AP:  1A-FE-34-9B-B2-3E
STE: 18-FE-34-9B-B2-3E

IP: 192.168.1.30
04/27/2020
This JSON data is on MongoDB database
{
    "_id": "5e839012a2b92c293c42053f",
    "Name": "ESP_D5C899",
    "Description": "Chip esp8266-01",
    "State": false,
    "Date": "2020-03-29T22:50:24.141Z",
    "__v": 0
  }
  _id is assigned by mongoDB
  
  Note : Got to Boards Manager and select:
  for esp8266-01 use Library esp8266 by esp8266 community V.2.5.0
  
 */
#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#ifndef STASSID
#define STASSID "NETGEAR79"
#define STAPSK  "dynamicplanet965"
#endif
const char* ssid = STASSID;
const char* password = STAPSK;

ESP8266WebServer server(80);
const int led = 2; //it was D1

void handleRoot() {
  //digitalWrite(led, 1);
  server.send(200, "text/plain", "hello from esp8266!");
  //digitalWrite(led, 0);
}

void handleNotFound() {
  //digitalWrite(led, 1);
  String message = "File Not Found\n\n";
  message += "URI: ";
  message += server.uri();
  message += "\nMethod: ";
  message += (server.method() == HTTP_GET) ? "GET" : "POST";
  message += "\nArguments: ";
  message += server.args();
  message += "\n";
  for (uint8_t i = 0; i < server.args(); i++) {
    message += " " + server.argName(i) + ": " + server.arg(i) + "\n";
  }
  server.send(404, "text/plain", message);
  //digitalWrite(led, 0);
}

void setup(void) {
  pinMode(led, OUTPUT);
  digitalWrite(led, 0);
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.println("");

  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  if (MDNS.begin("esp8266")) {
    Serial.println("MDNS responder started");
  }
  server.on("/", handleRoot);
  server.on("/Toggle", []() { 
    digitalWrite(led, !digitalRead(led));  // toggle state
    //int ledValue = digitalRead(led);
    server.send(200, "application/json; charset=utf-8", "{\"State\": " + String(digitalRead(led)) +"}");    
  });
  server.on("/On", []() {
    digitalWrite(led, true);  // state on
    //server.send(200, "text/plain", "this is on and works as well");
    server.send(200, "application/json; charset=utf-8", "{\"State\": " + String(digitalRead(led)) +"}");
    
  });
 
  server.on("/Off", []() {
    digitalWrite(led, false);  // state on
    //server.send(200, "text/plain", "this is off and works as well");
    server.send(200, "application/json; charset=utf-8", "{\"State\": " + String(digitalRead(led)) +"}");    
  });

  server.on("/State", []() {
    //server.send(200, "text/plain", "this is off and works as well");
    server.send(200, "application/json; charset=utf-8", "{\"State\": " + String(digitalRead(led)) +"}");    
  });
  server.on("/body", handleBody); //Associate the handler function to the path

  server.onNotFound(handleNotFound);
  server.begin();
  Serial.println("HTTP server started");
}
void loop(void) {
  server.handleClient();
  MDNS.update();
}

void handleBody() { //Handler for the body path
      
      if (server.hasArg("plain")== false){ //Check if body received
            server.send(200, "text/plain", "Body not received");
            return; 
      }      
      StaticJsonDocument<50> doc;     
      DeserializationError error = deserializeJson(doc, server.arg(0)); // Deserialize the JSON document
      // Test if parsing succeeds.
      if (error) {       
        server.send(200, "text/plain", "error parsing"); //server.arg(0));
        return;
      }
      //const char* Status = doc["Status"];
       String State = doc["State"]; // get body request => server.arg("plain"); 
       String responseToClient = server.arg(0);
      
      if (State == "true" || State == "1"){
        digitalWrite(led, true);  // State on
        server.send(200, "application/json", server.arg(0)); //server.arg(0));
        return;
      }             
      else if (State == "false" || State == "0"){
        digitalWrite(led, false);  // State off
        server.send(200, "application/json", server.arg(0)); //server.arg(0));
        return;                   
      }               
      else {
        String responseToClient = "";
        responseToClient += "Bad request json {key:name} ";
        responseToClient += server.arg(0); 
        responseToClient +=  " not found";
        server.send(400, "text/plain", responseToClient); //server.arg(0));     
      }                                     
}