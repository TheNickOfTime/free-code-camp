#!/bin/bash

PSQL="psql --username=freecodecamp --dbname=periodic_table -t --no-align -c"

if [[ -z $1 ]]
then
  echo "Please provide an element as an argument."
else
  ELEMENT_ID=0

  if [[ "$1" =~ [0-9]+ ]]
  then
    # echo "Atomic #$1"
    ELEMENT_ID=$($PSQL "SELECT atomic_number FROM elements WHERE atomic_number = $1")
  elif [[ "$1" =~ ^([A-Z])([a-z])?$ ]]
  then
    # echo "Symbol $1"
    ELEMENT_ID=$($PSQL "SELECT atomic_number FROM elements WHERE symbol = '$1'")
  elif [[ "$1" =~ ^([A-Z])([a-z]+)$ ]]
  then
    # echo "Name $1"
    ELEMENT_ID=$($PSQL "SELECT atomic_number FROM elements WHERE name = '$1'")
  else
    ELEMENT_ID=""
  fi

  if [[ -z $ELEMENT_ID ]]
  then
    echo "I could not find that element in the database."
  else
    BIG_QUERY=$($PSQL "SELECT atomic_number, symbol, name, type, atomic_mass, melting_point_celsius, boiling_point_celsius FROM elements INNER JOIN properties USING(atomic_number) INNER JOIN types USING(type_id) WHERE atomic_number = $ELEMENT_ID" | sed 's/|/ /g')
    # BIG_QURY$BIG_QUERY | sed 's/|/ /g' | read ATOMIC_NUMBER SYMBOL NAME TYPE ATOMIC_MASS MELTING_POINT BOILING_POINT
    echo "$BIG_QUERY" | while read ATOMIC_NUMBER SYMBOL NAME TYPE ATOMIC_MASS MELTING_POINT BOILING_POINT
    do
      echo "The element with atomic number $ATOMIC_NUMBER is $NAME ($SYMBOL). It's a $TYPE, with a mass of $ATOMIC_MASS amu. $NAME has a melting point of $MELTING_POINT celsius and a boiling point of $BOILING_POINT celsius."
    done
  fi
fi