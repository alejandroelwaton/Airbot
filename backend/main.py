from fastapi import FastAPI, WebSocket, Body, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
import csv
import os
from datetime import datetime
from fastapi import HTTPException
import pandas as pd
from pywebpush import webpush, WebPushException
import time
app = FastAPI()
clients = set()


CSV_DIR = "RoboNet"
os.makedirs(CSV_DIR, exist_ok=True)

FIELDNAMES = ["ID", "timestamp", "temp", "hum", "co", "co2"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Claves VAPID
VAPID_PUBLIC_KEY = "BNZfSnVZA12cOzoITwbiCnCYLCu662ZkaKljCljDgb5-d4ByXxt9isZwmpPJsQNGALYvaEVXoGB3gA9aZ0nwLRI"
VAPID_PRIVATE_KEY = "ch9DaMu5bXp08d4PYtmCEWEYgPGmbi9e3oD2yLur9ns"
VAPID_CLAIMS = {"sub": "mailto:dantesefiro190@gmail.com", "exp": int(time.time()) + 12*60*60}

# Lista de subscripciones
subscriptions = []

class SensorData(BaseModel):
    ID: int
    temp: float
    hum: float
    co: float   
    co2: float     


@app.post("/data")
async def receive_data(data: SensorData):
    filename = os.path.join(CSV_DIR, f"robot_{data.ID}.csv")

    file_exists = os.path.exists(filename)
    with open(filename, mode="a", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
        if not file_exists:
            writer.writeheader()
        writer.writerow({
            "ID": data.ID,
            "timestamp": datetime.now().isoformat(),
            "temp": data.temp,
            "hum": data.hum,
            "co": data.co,
            "co2": data.co2,
        })

    for ws in clients.copy():
        try:
            await ws.send_json(data.dict())
        except:
            clients.remove(ws)

    return {"message": "OK"}

 
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.add(websocket)
    try:
        while True:
            await asyncio.sleep(1)
    except:
        pass
    finally:
        clients.discard(websocket)



@app.get("/vapid_public_key")
def get_vapid_public_key():
    return {"publicKey": VAPID_PUBLIC_KEY}

@app.post("/subscribe")
async def subscribe(request: Request):
    sub = await request.json()
    subscriptions.append(sub)
    print("Nueva suscripción:", sub)
    return {"status": "subscribed"}

@app.post("/send")
async def send_push(request: Request):
    body = await request.json()
    message = body.get("message", "Alerta!")
    for sub in subscriptions:
        try:
            webpush(
                subscription_info=sub,
                data=message,
                vapid_private_key=VAPID_PRIVATE_KEY,
                vapid_claims=VAPID_CLAIMS,
            )
        except WebPushException as ex:
            print("Error enviando push:", ex)
    return {"status": "sent", "message": message}

@app.get("/predict/{robot_id}")
def predict_pollution(robot_id: int):
    data_file = os.path.join(CSV_DIR, f"robot_{robot_id}.csv")
    predictions_file = os.path.join(CSV_DIR, f"predictions_{robot_id}.csv")

    if not os.path.exists(data_file):
        raise HTTPException(status_code=404, detail="Robot data not found")

    df = pd.read_csv(data_file)

    if df.empty or len(df) < 3:
        raise HTTPException(status_code=400, detail="Not enough data to predict")

    avg_temp = df["temp"].tail(5).mean()
    avg_hum = df["hum"].tail(5).mean()
    avg_gas = (df["co"].tail(5).mean() + df["co2"].tail(5).mean()) / 2

    predicted_pollution = 0.6 * avg_gas + 0.2 * avg_temp + 0.2 * avg_hum

    if predicted_pollution < 100:
        recommendation = "Aire limpio, puedes salir con tranquilidad."
    elif predicted_pollution < 200:
        recommendation = "Calidad del aire moderada, evita actividades al aire libre prolongadas."
    else:
        recommendation = "Contaminación alta, evita salir y ventila bien tu espacio."

    prediction_record = {
        "timestamp": datetime.now().isoformat(),
        "predicted_pollution_index": round(predicted_pollution, 2),
        "recommendation": recommendation,
        "user_feedback": ""
    }

    file_exists = os.path.exists(predictions_file)
    with open(predictions_file, mode="a", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=prediction_record.keys())
        if not file_exists:
            writer.writeheader()
        writer.writerow(prediction_record)

    return {
        "robot_id": robot_id,
        **prediction_record
    }

@app.post("/feedback/{robot_id}")
def receive_feedback(robot_id: int, timestamp: str = Body(...), feedback: str = Body(...)):
    predictions_file = os.path.join(CSV_DIR, f"predictions_{robot_id}.csv")

    if not os.path.exists(predictions_file):
        raise HTTPException(status_code=404, detail="No predictions file found.")

    df = pd.read_csv(predictions_file)

    match = df["timestamp"] == timestamp
    if not match.any():
        raise HTTPException(status_code=404, detail="Prediction timestamp not found.")

    df.loc[match, "user_feedback"] = feedback.strip().lower()
    df.to_csv(predictions_file, index=False)

    return {"message": "Feedback saved successfully"}
