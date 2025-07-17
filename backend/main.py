from fastapi import FastAPI, WebSocket
from pydantic import BaseModel
import asyncio

app = FastAPI()
clients = set()

class SensorData(BaseModel):
    temp: float
    hum: float

@app.post("/data")
async def receive_data(data: SensorData):
    print(f"Recibido: Temp={data.temp}, Hum={data.hum}")

    disconnected = []
    for ws in clients:
        try:
            await ws.send_json({"temp": data.temp, "hum": data.hum})
        except:
            disconnected.append(ws)

    for ws in disconnected:
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
