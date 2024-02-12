#! /bin/bash

touch salon.sh
chmod +x salon.sh

PSQL="psql -X --username=freecodecamp --dbname=postgres --tuples-only -c"

$($PSQL "CREATE DATABASE salon")

PSQL="psql -X --username=freecodecamp --dbname=salon --tuples-only -c"

$($PSQL "CREATE TABLE customers()")
$($PSQL "ALTER TABLE customers ADD COLUMN customer_id SERIAL PRIMARY KEY")
$($PSQL "ALTER TABLE customers ADD COLUMN phone VARCHAR(15) UNIQUE NOT NULL")
$($PSQL "ALTER TABLE customers ADD COLUMN name VARCHAR(100) NOT NULL")

$($PSQL "CREATE TABLE appointments()")
$($PSQL "ALTER TABLE appointments ADD COLUMN appointment_id SERIAL PRIMARY KEY")
$($PSQL "ALTER TABLE appointments ADD COLUMN customer_id INT REFERENCES customers(customer_id)")
$($PSQL "ALTER TABLE appointments ADD COLUMN service_id INT REFERENCES services(service_id)")
$($PSQL "ALTER TABLE appointments ADD COLUMN time VARCHAR(10) NOT NULL")

$($PSQL "CREATE TABLE services()")
$($PSQL "ALTER TABLE services ADD COLUMN service_id SERIAL PRIMARY KEY")
$($PSQL "ALTER TABLE services ADD COLUMN name VARCHAR(100) NOT NULL")
$($PSQL "INSERT INTO services(name) VALUES('Standard Haircut'), ('Buzz Cut'), ('Straight Razor Shave')")