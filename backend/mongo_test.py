import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def test_connection():
    try:
        client = AsyncIOMotorClient("mongodb://root:rootpassword@localhost:27017/?authSource=admin")
        db = client.test  
        server_info = await db.command("ping")
        print("✅ Conexión exitosa:", server_info)
    except Exception as e:
        print("❌ Error de conexión:", e)
    finally:
        client.close()

asyncio.run(test_connection())
