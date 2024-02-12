#! /bin/bash

PSQL="psql -X --username=freecodecamp --dbname=salon --tuples-only -c"

echo -e "\n----------------------------\nHello, welcome to the Salon!\n----------------------------\n"

MAIN_MENU() {
  echo -e "What can we do for you today?"

  SERVICES=$($PSQL "SELECT service_id, name FROM services ORDER BY service_id")
  echo "$SERVICES" | while read SERVICE_ID BAR SERVICE_NAME
  do
    echo "$SERVICE_ID) $SERVICE_NAME"
  done

  echo -e "\n"

  read -p "Desired Service #: " SERVICE_ID_SELECTED #uncomment for better experience
  # read SERVICE_ID_SELECTED #uncomment for fcc validation
  SELECTED_SERVICE_NAME=$($PSQL "SELECT name FROM services WHERE service_id = $SERVICE_ID_SELECTED")
  case $SERVICE_ID_SELECTED in
    1) SELECT_SERVICE "$SELECTED_SERVICE_NAME" $SERVICE_ID_SELECTED ;;
    2) SELECT_SERVICE "$SELECTED_SERVICE_NAME" $SERVICE_ID_SELECTED ;;
    3) SELECT_SERVICE "$SELECTED_SERVICE_NAME" $SERVICE_ID_SELECTED ;;
    *) BAD_INPUT $SERVICE_ID_SELECTED "is not a valid service" ;;
    esac
}

BAD_INPUT() {
  read -p "ATTENTION: $1 $2. Press enter to try again." #uncomment for better experience
  echo -e "\n\n\n"
  MAIN_MENU
}

SELECT_SERVICE() {
  SERVICE_NAME="$1"
  SERVICE_ID=$2
  echo -e "\nA$SERVICE_NAME, Great!"
  echo "Now let's get you booked - I need some quick information:"
  read -p "What's your phone number?  " CUSTOMER_PHONE #uncomment for better experience
  # read CUSTOMER_PHONE #uncomment for fcc validation
  EXISTING_CUSTOMER_NAME=$($PSQL "SELECT name FROM customers WHERE phone = '$CUSTOMER_PHONE'")
  if [[ -z $EXISTING_CUSTOMER_NAME ]]
  then
    read -p "What's your name?  " CUSTOMER_NAME #uncomment for better experience
    # read CUSTOMER_NAME #uncomment for fcc validation
    CUSTOMER_NAME=$CUSTOMER_NAME | tr -d " "
    INSERT_CUSTOMER_RESULT=$($PSQL "INSERT INTO customers(name, phone) VALUES('$CUSTOMER_NAME', '$CUSTOMER_PHONE')")
    EXISTING_CUSTOMER_NAME=" $CUSTOMER_NAME"
  else
    echo -e "Welcome back, $EXISTING_CUSTOMER_NAME!"
  fi
  read -p "What time would you like to book for?  " SERVICE_TIME #uncomment for better experience
  # read SERVICE_TIME #uncomment for fcc validation

  CUSTOMER_ID=$($PSQL "SELECT customer_id FROM customers WHERE phone = '$CUSTOMER_PHONE'")
  INSERT_APPOINTMENT=$($PSQL "INSERT INTO appointments(customer_id, service_id, time) VALUES($CUSTOMER_ID, $SERVICE_ID, '$SERVICE_TIME')")

  echo -e "\nI have put you down for a$SERVICE_NAME at $SERVICE_TIME,$EXISTING_CUSTOMER_NAME."
}

MAIN_MENU