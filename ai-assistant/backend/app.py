# backend/app.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import os

load_dotenv()
print("OPENAI_API_KEY:", os.environ.get("OPENAI_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
llm = ChatOpenAI(model="gpt-4")

chat_history = [SystemMessage(content="You are an expert AI assistant.")]

class Query(BaseModel):
    message: str

@app.post("/chat")
def chat(query: Query):
    chat_history.append(HumanMessage(content=query.message))
    result = llm.invoke(chat_history)
    response = result.content
    chat_history.append(AIMessage(content=response))
    return {"response": response}

@app.get("/")
def read_root():
    return {"message": "Backend is working ✅"}
