#!/bin/bash

PSQL="psql --username=freecodecamp --dbname=number_guess -t --no-align -c"

RANDOM_NUMBER=$((1 + $RANDOM % 1000))
CURRENT_USER=''
NUMBER_OF_GAMES=0
NUMBER_OF_TRIES=0
NUMBER_TO_BEAT=0
echo $RANDOM_NUMBER

GET_USERNAME() {
  echo "Enter your username:"
  read USERNAME

  USER_ID=$($PSQL "SELECT user_id FROM users WHERE username = '$USERNAME'")
  if [[ -z $USER_ID ]]
  then
    INSERT_USER=$($PSQL "INSERT INTO users(username) VALUES('$USERNAME')")
    CURRENT_USER=$USERNAME

    echo "Welcome, $USERNAME! It looks like this is your first time here."
  else
    CURRENT_USER=$($PSQL "SELECT username FROM users WHERE user_id = $USER_ID")
    NUMBER_OF_GAMES=$($PSQL "SELECT games_played FROM users WHERE user_id = $USER_ID")
    NUMBER_TO_BEAT=$($PSQL "SELECT best_game FROM users WHERE user_id = $USER_ID")

    echo "Welcome back, $CURRENT_USER! You have played $NUMBER_OF_GAMES games, and your best game took $NUMBER_TO_BEAT guesses."
  fi

  GET_GUESSED_NUMBER "Guess the secret number between 1 and 1000:"
}

GET_GUESSED_NUMBER() {
  echo -e "\n$1"
  read GUESSED_NUMBER

  NUMBER_OF_GUESSES=$(($NUMBER_OF_GUESSES + 1))

  if [[ ! "$GUESSED_NUMBER" =~ [0-9]+ ]]
  then
    GET_GUESSED_NUMBER "That is not an integer, guess again:"
  else
    if [[ ${GUESSED_NUMBER#0} -gt ${RANDOM_NUMBER#0} ]]
    then
      GET_GUESSED_NUMBER "It's lower than that, guess again:"
    elif [[ ${GUESSED_NUMBER#0} -lt ${RANDOM_NUMBER#0} ]]
    then
      GET_GUESSED_NUMBER "It's higher than that, guess again:"
    else
      GAME_WON
      echo "You guessed it in $NUMBER_OF_GUESSES tries. The secret number was $RANDOM_NUMBER. Nice job!"
    fi
  fi
}

GAME_WON() {
  # check if this is the player's best game
  if [[ $NUMBER_OF_GUESSES -lt $NUMBER_TO_BEAT || $NUMBER_TO_BEAT -eq 0 ]]
  then
    NUMBER_TO_BEAT=$NUMBER_OF_GUESSES
  fi

  # increment games_played
  ((NUMBER_OF_GAMES++))

  # update user in db
  UPDATE_USER=$($PSQL "UPDATE users SET games_played = $NUMBER_OF_GAMES WHERE username = '$CURRENT_USER'")
  UPDATE_USER=$($PSQL "UPDATE users SET best_game = $NUMBER_TO_BEAT WHERE username = '$CURRENT_USER'")
}

GET_USERNAME

#dummy comment