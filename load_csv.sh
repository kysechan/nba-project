
if [ "$1" == "-h" ]; then
  echo "Usage: \$1 -> Name of database"
  echo "       \$2 -> Name of collection"
  echo "       \$3 -> csv file"
  exit 0
fi

mongoimport --type csv -d $1 -c $2 --headerline --drop $3 --port 27069
