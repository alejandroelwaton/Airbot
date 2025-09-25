from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio, csv, os, datetime, statistics
from apscheduler.schedulers.asyncio import AsyncIOScheduler
import tweepy
from dotenv import load_dotenv

# ----------------- Inicialización -----------------
app = FastAPI()
clients = set()
load_dotenv()

CSV_DIR = "RoboNet"
os.makedirs(CSV_DIR, exist_ok=True)
FIELDNAMES = ["ID", "timestamp", "temp", "hum", "co", "co2"]
data_buffer = []

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- Config OAuth 1.0a -----------------
API_KEY = os.getenv("TWITTER_API_KEY")
API_SECRET = os.getenv("TWITTER_API_SECRET")
ACCESS_TOKEN = os.getenv("TWITTER_ACCESS_TOKEN")
ACCESS_SECRET = os.getenv("TWITTER_ACCESS_SECRET")

twitter_client = tweepy.Client(
    consumer_key=API_KEY,
    consumer_secret=API_SECRET,
    access_token=ACCESS_TOKEN,
    access_token_secret=ACCESS_SECRET
)

# ----------------- Modelos -----------------
class SensorData(BaseModel):
    ID: int
    temp: float
    hum: float
    co: float
    co2: float

# ----------------- Endpoints de datos -----------------
@app.post("/data")
async def receive_data(data: SensorData):
    global data_buffer
    filename = os.path.join(CSV_DIR, f"robot_{data.ID}.csv")

    data_buffer.append({
        "ts": datetime.datetime.now(datetime.timezone.utc),
        **data.model_dump()
    })

    file_exists = os.path.exists(filename)
    with open(filename, "a", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
        if not file_exists:
            writer.writeheader()
        writer.writerow({
            "ID": data.ID,
            "timestamp": datetime.datetime.now().isoformat(),
            "temp": data.temp,
            "hum": data.hum,
            "co": data.co,
            "co2": data.co2
        })

    # Notificar a los websockets conectados
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

# ----------------- Función post summary -----------------
async def post_summary_async():
    global data_buffer, twitter_client
    if not data_buffer:
        return

    avg_temp = statistics.mean([d["temp"] for d in data_buffer])
    avg_hum = statistics.mean([d["hum"] for d in data_buffer])
    avg_co = statistics.mean([d["co"] for d in data_buffer])
    avg_co2 = statistics.mean([d["co2"] for d in data_buffer])

    status = "Normal"
    if avg_co2 > 1000 or avg_co > 9:
        status = "Alta"
    elif avg_co2 > 700 or avg_co > 5:
        status = "Leve"

    text = (f"Última hora\n"
            f"Temp: {avg_temp:.1f}°C\n"
            f"Hum: {avg_hum:.1f}%\n"
            f"CO: {avg_co:.1f}\n"
            f"CO₂: {avg_co2:.1f}\n"
            f"Estado: {status}\n"
            "#AirQuality #IoT #StudentProject")

    try:
        twitter_client.create_tweet(text=text)
        print("Tweet enviado")
    except Exception as e:
        print("Error enviando tweet:", e)

    data_buffer = []

# Endpoint para probar envío manual
@app.post("/post_summary")
async def post_summary_endpoint():
    text = (f"Última hora\n"
            f"Temp: {21}°C\n"
            f"Hum: {100}%\n"
            f"CO: {200}\n"
            f"CO₂: {300}\n"
            f"Estado: OK\n"
            "#AirQuality #IoT #StudentProject")
    twitter_client.create_tweet(text=text)
    return {"status": "Tweet enviado (si se permite)"}

# ----------------- Scheduler seguro -----------------
def post_summary_job():
    # Ejecuta la coroutine en un loop existente o nuevo
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    loop.run_until_complete(post_summary_async())

scheduler = AsyncIOScheduler()
scheduler.add_job(post_summary_job, "cron", minute=0)  # cada hora en el minuto 0
scheduler.start()
