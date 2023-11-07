# Code-Envision

## What is Code-Envison?

The envision competition is a 24-hour programming marathon addressed to young people from all over the country in which the participants, alone or in teams of 2 people, will create intelligent solutions for community problems of cities in Romania

We are open to creativity and thus will consider any solution, in any language and with any technology. The only requirement from this point of view is a thorough knowledge of the chosen language.

The envision competition will take place in Ploiesti, on November 4. Accommodation is provided by the organizers. For two days we will live together the emotions of the subjects, the adrenaline of the stopwatch and the passion for programming.

You will be able to participate in workshops organized by important people in the field who will provide you with valuable information about your career as well as development opportunities.

## Theme of the competition
Now in its first edition, Code Envision wants to bring as many coding enthusiasts between the ages of 16 and 25 together in one place with the goal of identifying and programming/solving a local community problem that hosts.

As pollution is the main problem of the citizens of Ploiești, it could not be ignored by the organizers.

The theme of this edition of the programming marathon is the identification of an IT solution for the creation of a network of IoT (Internet of Things) devices, which would monitor the evolution of the main polluting agents in the city.

The intention is to create a complementary system to the current system of air quality monitoring stations managed by the Prahova Environmental Protection Agency, including by measuring some polluting agents that the current stations do not identify.

The challenge for the participants of the marathon is to create a system that, in addition to monitoring air quality, can also provide free internet to users within the coverage area of the devices, so that they can transmit useful information and alerts to users.

## Technologies used:
* Pollution station: programmable board: ESP32, sensors: humidity and temperature, gas detection and particle sensor 2.5 and 1.0!
* Application backend: express
* Application frontend: react

## Connect station with backend
The connection was made through a request from the station to the API. Authentication was done with the unique token (which changes after each request) and the card's MAC!
The station sent every 10 s all the collected data to the API!

## API and Frontend
The database was MySql.
