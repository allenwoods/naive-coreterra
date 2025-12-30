from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, tasks, projects, users, gamification

app = FastAPI(
    title="Coreterra API",
    description="Coreterra MVP Backend API",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite default port
        "http://localhost:3000",  # Alternative frontend port
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(tasks.router)
app.include_router(projects.router)
app.include_router(users.router)
app.include_router(gamification.router)


@app.get("/")
async def root():
    return {"message": "Coreterra API", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}

