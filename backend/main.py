from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio, csv, os, datetime, statistics
from apscheduler.schedulers.asyncio import AsyncIOScheduler
import tweepy
from dotenv import load_dotenv

app = FastAPI()
clients = set()
load_dotenv()

CSV_DIR = "RoboNet"
os.makedirs(CSV_DIR, exist_ok=True)
FIELDNAMES = ["ID", "timestamp", "temp", "hum", "co", "co2"]

robot_buffers = {}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

class SensorData(BaseModel):
    ID: int
    temp: float
    hum: float
    co: float
    co2: float

@app.post("/data")
async def receive_data(data: SensorData):
    now = datetime.datetime.now(datetime.timezone.utc)
    if data.ID not in robot_buffers:
        robot_buffers[data.ID] = []

    robot_buffers[data.ID].append({
        "ts": now,
        "temp": float(data.temp),
        "hum": float(data.hum),
        "co": float(data.co),
        "co2": float(data.co2)
    })

    # Mantener solo datos de la última hora
    cutoff = now - datetime.timedelta(hours=1)
    robot_buffers[data.ID] = [d for d in robot_buffers[data.ID] if d["ts"] >= cutoff]

    # Guardar en CSV
    filename = os.path.join(CSV_DIR, f"robot_{data.ID}.csv")
    file_exists = os.path.exists(filename)
    with open(filename, "a", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
        if not file_exists:
            writer.writeheader()
        writer.writerow({
            "ID": data.ID,
            "timestamp": now.isoformat(),
            "temp": data.temp,
            "hum": data.hum,
            "co": data.co,
            "co2": data.co2
        })

    # Enviar datos a websockets conectados
    for ws in clients.copy():
        try:
            await ws.send_json(data.dict())
        except:
            clients.remove(ws)

    return {"message": "Data received"}

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

async def post_hourly_summary():
    all_data = [d for buffer in robot_buffers.values() for d in buffer]
    if not all_data:
        print("[SUMMARY] No data to summarize")
        return

    avg_temp = statistics.mean([d["temp"] for d in all_data])
    avg_hum = statistics.mean([d["hum"] for d in all_data])
    avg_co = statistics.mean([d["co"] for d in all_data])
    avg_co2 = statistics.mean([d["co2"] for d in all_data])

    status = "Normal"
    if avg_co2 > 80 or avg_co > 180:
        status = "High"
    elif avg_co2 > 40 or avg_co > 140:
        status = "Moderate"

    text = (f"Last hour summary\n"
            f"Temp: {avg_temp:.1f}°C\n"
            f"Hum: {avg_hum:.1f}%\n"
            f"CO: {avg_co:.1f}\n"
            f"CO₂: {avg_co2:.1f}\n"
            f"Status: {status}\n"
            "#AirQuality #IoT #StudentProject")

    print("[SUMMARY] Posting hourly summary:", text)

    try:
        twitter_client.create_tweet(text=text)
        print("[SUMMARY] Hourly summary tweet sent")
    except Exception as e:
        print("[SUMMARY] Error sending hourly tweet:", e)

    # Limpiar buffers después de enviar resumen
    for key in robot_buffers:
        robot_buffers[key].clear()

async def post_urgent_check(robot_id=None):
    now = datetime.datetime.now(datetime.timezone.utc)
    cutoff = now - datetime.timedelta(minutes=5)

    buffers_to_check = [robot_buffers[robot_id]] if robot_id else robot_buffers.values()
    alert_sent = False
    
    for idx, buf in enumerate(buffers_to_check):
        recent_data = [d for d in buf if d["ts"] >= cutoff]
        if not recent_data:
            print(f"[URGENT] Robot {robot_id if robot_id else idx} - No recent data")
            continue

        avg_temp = statistics.mean([d["temp"] for d in recent_data])
        avg_hum = statistics.mean([d["hum"] for d in recent_data])
        avg_co = statistics.mean([d["co"] for d in recent_data])
        avg_co2 = statistics.mean([d["co2"] for d in recent_data])

        # Debug: imprimir todos los valores calculados
        print(f"[URGENT DEBUG] Robot {robot_id if robot_id else idx} - Avg Temp: {avg_temp}, Hum: {avg_hum}, CO: {avg_co}, CO2: {avg_co2}")

        urgent = False
        status = "Normal"
        if avg_co2 > 80 or avg_co > 180:
            status = "High"
            urgent = True
        elif avg_co2 > 40 or avg_co > 140:
            status = "Moderate"

        print(f"[URGENT DEBUG] Robot {robot_id if robot_id else idx} - Status: {status}, Urgent: {urgent}")

        if urgent:
            text = (f"⚠️ URGENT ALERT ⚠️\n"
                    f"Last 5 minutes\n"
                    f"Temp: {avg_temp:.1f}°C\n"
                    f"Hum: {avg_hum:.1f}%\n"
                    f"CO: {avg_co:.1f}\n"
                    f"CO₂: {avg_co2:.1f}\n"
                    f"Status: {status}\n"
                    "#AirQuality #IoT #StudentProject")
            try:
                twitter_client.create_tweet(text=text)
                print(f"[URGENT] Urgent tweet sent for robot {robot_id if robot_id else idx}")
                alert_sent = True
            except Exception as e:
                print("[URGENT] Error sending urgent tweet:", e)

    return {"alert_sent": alert_sent}

@app.post("/post_summary")
async def post_summary_endpoint():
    await post_hourly_summary()
    return {"status": "Hourly summary tweet sent"}

@app.post("/post_urgent")
async def post_urgent_endpoint(robot_id: int = None):
    result = await post_urgent_check(robot_id)
    return result

def run_async_task(coro):
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    loop.run_until_complete(coro)

scheduler = AsyncIOScheduler()
scheduler.add_job(lambda: run_async_task(post_hourly_summary()), "cron", minute=0)
scheduler.add_job(lambda: run_async_task(post_urgent_check()), "interval", minutes=5)
scheduler.start()
