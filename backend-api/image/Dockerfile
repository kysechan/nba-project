FROM python:3.7-stretch

RUN apt-get update && apt-get install -y --no-install-recommends
RUN pip3 install --upgrade pip

WORKDIR /app
COPY . /app

ENV ENV_TYPE=PROD
ENV FLASK_APP=server.py
ENV FLASK_ENV=production

COPY image/entrypoint.sh /app
RUN chmod +x ./entrypoint.sh

RUN pip3 install -r requirements.txt

EXPOSE 8080

CMD ["./entrypoint.sh"]


